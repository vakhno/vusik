// tanstack
import { useMutation, useQueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/features/animal/deleteAnimal/api/deleteAnimal";
// routes
import { API_DELETE_ANIMAL } from "@/shared/constants/routes";
// mongoose
import { Types } from "mongoose";

const fetchData = async (animalId: Types.ObjectId) => {
	try {
		const formData = new FormData();

		formData.append("animalId", String(animalId));

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_DELETE_ANIMAL}`, {
			method: "DELETE",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				return true;
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

export const queryDeleteAnimal = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (animalId: Types.ObjectId) => {
			return fetchData(animalId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["all-animals"] });
			queryClient.invalidateQueries({ queryKey: ["all-animals-filter"] });
		},
	});
};
