// tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/features/animal/newAnimal/api/postNewAnimal";
// routes
import { API_NEW_ANIMAL } from "@/routes";

import NewAnimalSchemaType from "@/features/animal/newAnimal/model/type/newAnimalSchemaType";

const fetchData = async (animal: NewAnimalSchemaType) => {
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
		} = animal;

		const formData = new FormData();

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

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_NEW_ANIMAL}`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { animal } = data;
				return { animal };
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

export const queryNewAnimal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newAnimal: NewAnimalSchemaType) => {
			return fetchData(newAnimal);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["all-animals"] });
			queryClient.invalidateQueries({ queryKey: ["all-animals-filter"] });
		},
	});
};
