// tanstack
import { useMutation } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/features/animal/newAnimal/api/postNewAnimal";
// routes

import NewAnimalSchemaType from "@/features/animal/newAnimal/model/type/newAnimalSchemaType";
import { AnimalType } from "@/entities/animal/model/type/animal";

const mutationFn = async (animal: NewAnimalSchemaType & { id: string }) => {
	try {
		const {
			mainPhoto,
			secondaryPhotos,
			name,
			species,
			breed,
			shelterId,
			size,
			sex,
			sterilized,
			injury,
			injuryDescription,
			age,
			id,
		} = animal;

		const formData = new FormData();

		formData.append("id", id);
		formData.append("name", name);
		formData.append("species", species);
		formData.append("breed", breed);
		formData.append("shelterId", shelterId);
		formData.append("size", size);
		formData.append("sex", sex);
		formData.append("age", String(age));
		formData.append("sterilized", JSON.stringify(sterilized));
		formData.append("injury", JSON.stringify(injury));
		formData.append("injuryDescription", String(injuryDescription));

		if (mainPhoto) {
			formData.append("mainPhoto", mainPhoto);
		}

		if (secondaryPhotos && secondaryPhotos.length) {
			secondaryPhotos.forEach((secondaryPhoto) => {
				formData.append("secondaryPhotos[]", secondaryPhoto);
			});
		}

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/put-edit-animal`, {
			method: "PUT",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { animal } = data;
				return animal;
			} else {
				throw new Error("");
			}
		} else {
			throw new Error("");
		}
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error(String(error));
		}
	}
};

type mutateProps = {
	onSuccess?: (animal: AnimalType) => void;
	onError?: (error: string) => void;
};

export const queryEditAnimal = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
		// queryClient.invalidateQueries({ queryKey: ["all-animals"] });
		// queryClient.invalidateQueries({ queryKey: ["all-animals-filter"] });
	});
};
