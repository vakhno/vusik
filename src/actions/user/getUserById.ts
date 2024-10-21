"use server";

// types
import { UserType } from "@/types/user.type";
// mongoose
import { Types } from "mongoose";

interface Props {
	userId: Types.ObjectId;
}

type Result = UserType | null;

export const getUserById = async ({ userId }: Props): Promise<Result> => {
	try {
		const formData = new FormData();

		formData.append("userId", userId.toString());

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/user/get-user-by-id`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				const { user } = data;

				return user;
			} else {
				return null;
			}
		} else {
			return null;
		}
	} catch (_) {
		return null;
	}
};
