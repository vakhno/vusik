"use server";

// mongoose
import { Types } from "mongoose";
// types
import { AnimalType } from "@/types/animal.type";

interface Props {
	animalIds: Types.ObjectId[];
}

type Result = AnimalType[];

export const getAnimalsById = async ({ animalIds }: Props): Promise<Result> => {
	try {
		const formData = new FormData();

		animalIds.forEach((animalId) => formData.append("animalIds[]", animalId.toString()));

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-user-animals`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			let userAnimals = [];

			const data = await response.json();

			const { success } = data;

			if (success) {
				const { animals } = data;
				userAnimals = animals;
			}

			return userAnimals;
		} else {
			return [];
		}
	} catch (_) {
		return [];
	}
};
