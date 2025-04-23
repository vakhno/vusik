// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// shared
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { API_GET_SHELTER_BY_ID } from "@/shared/constants/routes";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-shelter-by-id/route";

type QueryFnProps = {
	shelterId: string;
};

type FetchProps = {
	shelterId: string;
};

type PrefetchProps = {
	shelterId: string;
	queryClient: QueryClient;
};

const queryFn = async ({ shelterId }: QueryFnProps) => {
	const urlSearchParams = new URLSearchParams();

	urlSearchParams.set("id", shelterId);

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_SHELTER_BY_ID}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { shelter },
	} = result;

	return shelter;
};

export const query_getShelter = ({ shelterId }: FetchProps) => {
	return useQuery({
		queryKey: ["shelter", shelterId],
		queryFn: () => queryFn({ shelterId }),
	});
};

export const prefetchQuery_getShelter = async ({ shelterId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["shelter", shelterId],
		queryFn: () => queryFn({ shelterId }),
	});

	return queryClient;
};
