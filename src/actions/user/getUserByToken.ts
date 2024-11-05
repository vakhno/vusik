"use server";

// next tools
import { cookies } from "next/headers";
// actions
import { getUserById } from "@/actions/user/getUserById";
// types
import { ProfileType } from "@/types/profile.type";
import { Types } from "mongoose";

type Result = ProfileType | null;

export const getUserByToken = async (): Promise<Result> => {
	try {
		const cookie = cookies();
		const token = cookie.get("token");

		if (token) {
			const { value } = token;
			const userId = new Types.ObjectId(value);
			const result = await getUserById({ userId: userId });

			return result;
		} else {
			return null;
		}
	} catch (_) {
		return null;
	}
};
