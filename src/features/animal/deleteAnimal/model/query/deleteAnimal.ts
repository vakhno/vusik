// tanstack
import { useMutation } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/delete-animal/route";
// routes
import { API_DELETE_ANIMAL } from "@/shared/constants/routes";

type mutateProps = {
	onSuccess?: (data: SuccessResponse) => void;
	onError?: (data: ErrorResponse) => void;
};

type mutateFnProps = {
	animalId: string;
};

const mutationFn = async ({ animalId }: mutateFnProps) => {
	const formData = new FormData();

	formData.append("animalId", animalId);

	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_DELETE_ANIMAL}`, { method: "DELETE", body: formData });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		throw result;
	}

	return result;
};

export const queryDeleteAnimal = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
		// onSuccess: () => {
		// 	queryClient.invalidateQueries({ queryKey: ["all-animals"] });
		// 	queryClient.invalidateQueries({ queryKey: ["all-animals-filter"] });
		// },
	});
};
