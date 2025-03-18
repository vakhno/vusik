// features
import SignInSchema from "@/features/auth/signIn/model/schema/signInForm";
import convertFormDataToSignInSchema from "@/features/auth/signIn/model/utils/convertFormDataToSignInSchema";
// shared
import { mongoConnection } from "@/shared/lib/mongodb";
// entities
import UserModel from "@/entities/profile/model/model";
import { UserType } from "@/entities/profile/model/type/profile";
// bcryptjs
import bcrypt from "bcryptjs";
// jsonwebtoken
import jwt from "jsonwebtoken";
// next tools
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// next-intl
import { getTranslations, getLocale } from "next-intl/server";

export type SuccessResponse = {
	success: true;
	data: {
		user: UserType;
	};
};

export type ErrorResponse = {
	success: false;
	error: {
		message: string;
		code: number;
	};
};

type Props = {
	req: Request;
};

const Index = async ({ req }: Props): Promise<NextResponse<SuccessResponse | ErrorResponse>> => {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	try {
		await mongoConnection();

		const signInSchema = SignInSchema(t);
		const formData = await req.formData();
		const data = convertFormDataToSignInSchema(formData);
		const validationResult = signInSchema.safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (isValidationPassed) {
			const { email: enteredEmail, password: enteredPassword } = data;
			const user = await UserModel.findOne({
				email: enteredEmail,
			})
				.select("+password")
				.lean();

			if (user) {
				const { password: userPassword } = user;
				if (userPassword) {
					const isPasswordValid: boolean = await bcrypt.compare(enteredPassword, userPassword);

					if (isPasswordValid) {
						const { password, ...userWithoutPassword } = user;

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
								data: {
									user: userWithoutPassword,
								},
							},
							{ status: 200 },
						);
					} else {
						return NextResponse.json(
							{ success: false, error: { message: t("page.auth.sign-in.api.401"), code: 401 } },
							{ status: 401 },
						);
					}
				} else {
					return NextResponse.json(
						{ success: false, error: { message: t("page.auth.sign-in.api.401"), code: 401 } },
						{ status: 401 },
					);
				}
			} else {
				return NextResponse.json(
					{ success: false, error: { message: t("page.auth.sign-in.api.404"), code: 404 } },
					{ status: 404 },
				);
			}
		} else {
			const { errors } = validationResult.error;
			const errorMessage = errors[0].message;

			return NextResponse.json(
				{
					success: false,
					error: { message: errorMessage, code: 400 },
				},
				{ status: 400 },
			);
		}
	} catch (_) {
		return NextResponse.json(
			{ success: false, error: { message: t("page.auth.sign-in.api.500"), code: 500 } },
			{ status: 500 },
		);
	}
};

export default Index;
