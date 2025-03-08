import { SignInSchema } from "@/features/auth/signIn/model/schema/signInForm";
import { SignInSchemaType } from "@/features/auth/signIn/model/type/signInFormSchema";
import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserType } from "@/entities/profile/model/type/profile";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

export type SuccessResponse = {
	success: true;
	user: UserType;
};

export type ErrorResponse = {
	success: false;
	error: string;
};

const getFormDataValue = (formData: FormData): SignInSchemaType => {
	const data = {} as SignInSchemaType;

	if (formData.has("email") && formData.get("email")) {
		data.email = formData.get("email") as string;
	}

	if (formData.has("password") && formData.get("password")) {
		data.password = formData.get("password") as string;
	}

	return data;
};

type Props = {
	formData: FormData;
};

const Index = async ({ formData }: Props): Promise<NextResponse<SuccessResponse | ErrorResponse>> => {
	try {
		await mongoConnection();

		const locale = await getLocale();
		const t = await getTranslations({ locale });
		const signInSchema = SignInSchema(t);
		const data = getFormDataValue(formData) as SignInSchemaType;
		const validationResult = signInSchema.safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (isValidationPassed) {
			const { email: enteredEmail, password: enteredPassword } = data;
			const user = await UserModel.findOne({
				email: enteredEmail,
			}).select("+password");

			if (user) {
				const { password: userPassword } = user._doc;
				const isPasswordValid: boolean = await bcrypt.compare(enteredPassword, userPassword);

				if (isPasswordValid) {
					const { password, ...userWithoutPassword } = user._doc;

					const token = jwt.sign(
						{
							id: userWithoutPassword._id,
							role: userWithoutPassword.role,
						},
						process.env.JWT_SECRET || "",
						{
							expiresIn: "6h",
						},
					);

					cookies().set({
						name: "token",
						secure: true,
						value: token,
						maxAge: 3600,
						httpOnly: true,
					});

					return NextResponse.json(
						{
							success: true,
							user: userWithoutPassword,
						},
						{ status: 200 },
					);
				} else {
					return NextResponse.json(
						{ success: false, error: t("page.auth.sign-in.api.401") },
						{ status: 401 },
					);
				}
			} else {
				return NextResponse.json({ success: false, error: t("page.auth.sign-in.api.404") }, { status: 404 });
			}
		} else {
			const { errors } = validationResult.error;
			const errorMessage = errors[0].message;

			return NextResponse.json(
				{
					success: false,
					error: t("page.auth.sign-in.api.400", { error: errorMessage }),
				},
				{ status: 400 },
			);
		}
	} catch (_) {
		return NextResponse.json({ success: false, error: "Something went wrong!" }, { status: 500 });
	}
};

export default Index;
