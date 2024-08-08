import SignUpSchema from "@/schemas/sign-up/sign-up.schema";
import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import { UserType } from "@/types/user.type";
import bcrypt from "bcrypt";
import * as z from "zod";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
	SuccessResponse as S3UploadAvatarSuccessResponse,
	ErrorResponse as S3UploadAvatarErrorResponse,
} from "@/app/api/s3/upload-avatar/route";
import { getTranslations } from "next-intl/server";
import { VUSIK_LOCALE_COOKIE_KEY, defaultLocale } from "@/constants/locale";

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
		const formData = await req.formData();
		const t = await getTranslations({ locale });
		const signUpSchema = SignUpSchema({ t });
		const data = Object.fromEntries(formData.entries()) as z.infer<typeof signUpSchema>;

		if (data.avatar) {
			const avatarAsFile = new File([data.avatar], "avatar", {
				type: data.avatar.type,
			});
			data.avatar = avatarAsFile;
		}

		const validationResult = signUpSchema.safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (isValidationPassed) {
			const { password: enteredPassword, email: enteredEmail, name: enteredName, avatar: enteredAvatar } = data;
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
					const { _id: userId } = newUser;
					let avatarURL = "";
					if (enteredAvatar) {
						const formData = new FormData();

						formData.append("file", enteredAvatar);
						formData.append("id", userId);

						const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/s3/upload-avatar`, {
							method: "POST",
							body: formData,
						});
						const data: S3UploadAvatarSuccessResponse | S3UploadAvatarErrorResponse = await response.json();
						const { success } = data;

						if (success) {
							const { url } = data;

							avatarURL = url;
						}
					}

					newUser.avatar = avatarURL;

					await newUser.save();

					const token = jwt.sign(
						{
							id: userId,
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

					return NextResponse.json({ success: true, user: newUser }, { status: 200 });
				} else {
					return NextResponse.json({ success: false }, { status: 500 });
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
