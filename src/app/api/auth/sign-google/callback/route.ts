import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import { UserType } from "@/entities/profile/model/type";
import axios from "axios";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const state = searchParams.get("state");
	const [successRedirection, errorRedirection] = state?.split(" ") as string[];
	try {
		await mongoConnection();

		const code = searchParams.get("code");
		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || "",
				client_secret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET || "",
				code: code || "",
				redirect_uri: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI || "",
				grant_type: "authorization_code",
			}),
		});
		const data = await response.json();
		const { access_token } = data;
		const { data: googleUser } = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?prompt=consent", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		const { email, name, verified_email } = googleUser;

		if (!verified_email) {
			return Response.json({ success: false }, { status: 400 });
		}

		const existingUser = await UserModel.findOne({
			email,
		});
		let user = {} as UserType;

		if (existingUser) {
			user = existingUser;
		} else {
			const newUser = new UserModel({
				email,
				name,
				isSocial: true,
			});

			await newUser.save();

			user = newUser;
		}

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role,
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

		return NextResponse.redirect(successRedirection);
	} catch (_) {
		return NextResponse.redirect(errorRedirection);
	}
}
