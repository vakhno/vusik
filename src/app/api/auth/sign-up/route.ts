import { SignUpSchema } from "@/features/auth/signUp/model/schema";
import { SignUpSchemaType } from "@/features/auth/signUp/model/type";
import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import { UserType } from "@/entities/profile/model/type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
export interface SuccessResponse {
	success: true;
	user: UserType;
}

export interface ErrorResponse {
	success: false;
	error: string;
}

const getFormDataValue = (formData: FormData): SignUpSchemaType => {
	const data = {} as SignUpSchemaType;

	if (formData.has("name") && formData.get("name")) {
		data.name = formData.get("name") as string;
	}

	if (formData.has("email") && formData.get("email")) {
		data.email = formData.get("email") as string;
	}

	if (formData.has("password") && formData.get("password")) {
		data.password = formData.get("password") as string;
	}

	if (formData.has("confirmPassword") && formData.get("confirmPassword")) {
		data.confirmPassword = formData.get("confirmPassword") as string;
	}

	return data;
};

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const formData = await req.formData();
		const data = getFormDataValue(formData) as SignUpSchemaType;
		const locale = await getLocale();
		const t = await getTranslations({ locale });
		const validationResult = SignUpSchema(t).safeParse(data);
		const { success: isValidationsuccess } = validationResult;

		if (isValidationsuccess) {
			const { password: enteredPassword, email: enteredEmail, name: enteredName } = data;
			const user = await UserModel.findOne({
				email: enteredEmail,
			});

			if (!user) {
				const salt = await bcrypt.genSalt(12);
				const hashedPassword = await bcrypt.hash(enteredPassword, salt);
				const newUser = new UserModel({
					name: enteredName,
					email: enteredEmail,
					password: hashedPassword,
				});

				if (newUser) {
					const { _id: userId, role } = newUser;

					await newUser.save();

					const token = jwt.sign(
						{
							id: userId,
							role: role,
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

					return NextResponse.json({ success: true, user: newUser }, { status: 200 });
				} else {
					return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
				}
			} else {
				return NextResponse.json({ success: false, error: "User already exist" }, { status: 400 });
			}
		} else {
			const { errors } = validationResult.error;
			const errorMessage = errors[0].message;

			return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
		}
	} catch (_) {
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
