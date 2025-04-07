// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-all-animals-filters/route";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS } from "@/shared/constants/routes";
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";

type QueryFnProps = {
	searchParams: SearchParamsType;
};

type FetchProps = {
	searchParams: SearchParamsType;
};

type PrefetchProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
};

const queryFn = async ({ searchParams }: QueryFnProps) => {
	const urlSearchParams = convertObjectToURLSearchParams(searchParams);
	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS}/?${urlSearchParams}`, {
		method: "GET",
	});
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { availableOptions, shelters, selectedOptions },
	} = result;

	return { availableOptions, shelters, selectedOptions };
};

export const query_getAllAnimalsFilter = ({ searchParams }: FetchProps) => {
	return useQuery({
		queryKey: ["all-animals-filter", JSON.stringify(searchParams)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => queryFn({ searchParams }),
	});
};

export const prefetchQuery_getAllAnimalsFilter = async ({ searchParams, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["all-animals-filter", JSON.stringify(searchParams)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => queryFn({ searchParams }),
	});

	return queryClient;
};
