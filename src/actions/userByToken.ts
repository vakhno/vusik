import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const userByToken = () => {
	const cookie = cookies();
	const token = cookie.get("token")?.value;
	let user = null;

	if (token) {
		user = jwt.verify(String(token), process.env.NEXT_PUBLIC_JWT_SECRET || "");
	}

	return user;
};

export default userByToken;
