import jwt from "jsonwebtoken";
import UserModel from "@/entities/profile/model/model";
import { AuthUserTokenDataType } from "@/shared/types/token.type";
import { UserType } from "@/entities/profile/model/type/profile";

export interface SuccessResponse {
	success: true;
	user: UserType;
}

export interface ErrorResponse {
	success: false;
}

export async function GET(req: Request) {
	try {
		const authHeader = req.headers.get("authorization");
		const token = authHeader && authHeader.split(" ")[1];

		if (token) {
			const data = jwt.verify(String(token), process.env.NEXT_PUBLIC_JWT_SECRET || "") as AuthUserTokenDataType;
			const { id } = data;
			const user = await UserModel.findById(id);

			if (user) {
				return Response.json({ success: true, user }, { status: 200 });
			} else {
				return Response.json({ success: false }, { status: 400 });
			}
		} else {
			return Response.json({ success: false }, { status: 400 });
		}
	} catch (_) {
		return Response.json({ success: false }, { status: 500 });
	}
}
