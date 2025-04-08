// features
import SignUpSchema from "@/features/auth/signUp/model/schema/signUpForm";
// shared
import { mongoConnection } from "@/shared/lib/mongodb";
import convertFormDataToObject from "@/shared/utils/convertFormDataToObject";
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

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	try {
		await mongoConnection();

		const signUpSchema = SignUpSchema(t);
		const formData = await req.formData();
		const data = convertFormDataToObject(formData);
		const validationResult = signUpSchema.safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (isValidationPassed) {
			const { password: enteredPassword, email: enteredEmail, name: enteredName } = data;
			const user = await UserModel.findOne({
				email: enteredEmail,
			}).lean();

			if (!user) {
				const salt = await bcrypt.genSalt(12);
				const hashedPassword = await bcrypt.hash(String(enteredPassword), salt);
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

					return NextResponse.json({ success: true, data: { user: newUser } }, { status: 200 });
				} else {
					return NextResponse.json({ success: false, error: { message: t("page.auth.sign-up.api.503"), code: 503 } }, { status: 503 });
				}
			} else {
				return NextResponse.json({ success: false, error: { message: t("page.auth.sign-up.api.409"), code: 409 } }, { status: 409 });
			}
		} else {
			const { errors } = validationResult.error;
			const errorMessage = errors[0].message;

			return NextResponse.json({ success: false, error: { message: t("page.auth.sign-up.api.400", { error: errorMessage }), code: 400 } }, { status: 400 });
		}
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: t("page.auth.sign-up.api.500"), code: 500 } }, { status: 500 });
	}
}
