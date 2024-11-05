"use server";
// mongoose
import { Types } from "mongoose";

interface Props {
	animalId: Types.ObjectId;
	shelterId: Types.ObjectId;
	userId: Types.ObjectId;
}

type Result = boolean;

export const deleteAnimalById = async ({ animalId, shelterId, userId }: Props): Promise<Result> => {
	try {
		const formData = new FormData();

		formData.append("animalId", animalId.toString());
		formData.append("shelterId", shelterId.toString());
		formData.append("userId", userId.toString());

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/delete-animal`, {
			method: "DELETE",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};
