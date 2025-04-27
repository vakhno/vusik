// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-animals-related-to-animal/route";
// shared
import { API_GET_ANIMALS_RELATED_TO_ANIMAL } from "@/shared/constants/routes";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";

type QueryFnProps = {
	animalId: string;
};

type FetchProps = {
	animalId: string;
};

type PrefetchProps = {
	animalId: string;
	queryClient: QueryClient;
};

const queryFn = async ({ animalId }: QueryFnProps) => {
	const urlSearchParams = new URLSearchParams();

	urlSearchParams.set("id", animalId);

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMALS_RELATED_TO_ANIMAL}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { animals },
	} = result;

	return { animals };
};

export const query_getAnimalsRelatedToAnimal = ({ animalId }: FetchProps) => {
	return useQuery({
		queryKey: ["animals-related-by-animal", animalId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => queryFn({ animalId }),
	});
};

export const prefetchQuery_getAnimalsRelatedToAnimal = async ({ animalId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["animals-related-by-animal", animalId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => queryFn({ animalId }),
	});

	return queryClient;
};
