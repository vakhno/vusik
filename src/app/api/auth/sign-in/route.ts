import * as z from "zod";
import SignInSchema from "@/schemas/sign-in/sign-in.schema";
import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserType } from "@/types/user.type";
import { NextResponse } from "next/server";
import { VUSIK_LOCALE_COOKIE_KEY, defaultLocale } from "@/constants/locale";
import { getTranslations } from "next-intl/server";

export interface SuccessResponse {
	success: true;
	user: UserType;
}

export interface ErrorResponse {
	success: false;
}

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const cookie = cookies();
		const locale = cookie.get(VUSIK_LOCALE_COOKIE_KEY)?.value || defaultLocale;
		const t = await getTranslations({ locale });
		const signInSchema = SignInSchema({ t });
		const formData = await req.formData();
		const data = Object.fromEntries(formData.entries()) as z.infer<typeof signInSchema>;
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
						},
						process.env.JWT_SECRET || "",
						{
							expiresIn: "1h",
						},
					);

					cookies().set({
						name: "token",
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
					return NextResponse.json({ success: false }, { status: 400 });
				}
			} else {
				return NextResponse.json({ success: false }, { status: 400 });
			}
		} else {
			return NextResponse.json({ success: false }, { status: 400 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
