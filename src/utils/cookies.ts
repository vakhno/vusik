// next tools
import { cookies } from "next/headers";
// JWT
import jwt from "jsonwebtoken";
// types
import { AuthUserTokenDataType } from "@/types/token.type";
// mongoose
import { Types } from "mongoose";

type getCookiesIdResult = Types.ObjectId | null;

export const getCookiesId = (): getCookiesIdResult => {
	const cookie = cookies();
	const token = cookie.get("token");

	if (token) {
		const { value } = token;

		try {
			const data = jwt.verify(String(value), process.env.NEXT_PUBLIC_JWT_SECRET || "") as AuthUserTokenDataType;
			const { id } = data;
			if (id) {
				const objectId = new Types.ObjectId(id);

				return objectId;
			} else {
				return null;
			}
		} catch (_) {
			return null;
		}
	}

	return null;
};
