"use server";

// next tools
import { cookies } from "next/headers";
// actions
import { getUserById } from "@/actions/user/getUserById";
// types
import { UserType } from "@/types/user.type";

type Result = UserType | null;

export const getUserByToken = async (): Promise<Result> => {
	try {
		const cookie = cookies();
		const token = cookie.get("token");

		if (token) {
			const { value } = token;

			const result = await getUserById({ userId: value });

			return result;
		} else {
			return null;
		}
	} catch (_) {
		return null;
	}
};
