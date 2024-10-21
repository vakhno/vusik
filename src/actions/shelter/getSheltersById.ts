"use server";

// mongoose
import { Types } from "mongoose";
// types
import { ShelterType } from "@/types/shelter.type";

interface Props {
	shelterIds: Types.ObjectId[];
}

type Result = ShelterType[];

export const getSheltersById = async ({ shelterIds }: Props): Promise<Result> => {
	try {
		const formData = new FormData();

		shelterIds.forEach((shelterId: Types.ObjectId) => formData.append("shelterIds[]", shelterId.toString()));

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-user-shelters-by-id`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			let userShelters = [];
			const data = await response.json();
			const { success } = data;

			if (success) {
				const { shelters } = data;
				userShelters = shelters;
			}

			return userShelters;
		} else {
			return [];
		}
	} catch (_) {
		return [];
	}
};
