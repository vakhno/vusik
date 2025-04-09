// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-animal-by-id/route";
// shared
import { API_GET_ANIMAL_BY_ID } from "@/shared/constants/routes";
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

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMAL_BY_ID}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { animal },
	} = result;

	return { animal: animal };
};

export const query_getAnimalById = ({ animalId }: FetchProps) => {
	return useQuery({
		queryKey: ["animal-by-id", animalId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => queryFn({ animalId }),
	});
};

export const prefetchQuery_getAnimalById = async ({ animalId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["animal-by-id", animalId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => queryFn({ animalId }),
	});

	return queryClient;
};
