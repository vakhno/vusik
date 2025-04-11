// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-all-shelters-filters/route";
// shared
import { API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS } from "@/shared/constants/routes";
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";

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
	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS}/?${urlSearchParams}`, { method: "GET" });
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

export const query_getAllSheltersFilter = ({ searchParams }: FetchProps) => {
	return useQuery({
		queryKey: ["all-shelters-filter", JSON.stringify(searchParams)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => queryFn({ searchParams }),
	});
};

export const prefetchQuery_getAllSheltersFilter = async ({ searchParams, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["all-shelters-filter", JSON.stringify(searchParams)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => queryFn({ searchParams }),
	});

	return queryClient;
};
