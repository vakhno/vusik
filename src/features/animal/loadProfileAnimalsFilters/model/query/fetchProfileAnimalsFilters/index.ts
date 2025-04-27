// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-profile-animals-filters/route";
// shared
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { API_GET_BY_USER_ID_ANIMALS_FILTER_OPTIONS } from "@/shared/constants/routes";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";

type QueryFnProps = {
	userId: string;
	searchParams: SearchParamsType;
};

type FetchProps = {
	searchParams: SearchParamsType;
	userId: string;
};

type PrefetchProps = {
	searchParams: SearchParamsType;
	userId: string;
	queryClient: QueryClient;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
	userId: string;
};

const queryFn = async ({ userId, searchParams }: QueryFnProps) => {
	const urlSearchParams = convertObjectToURLSearchParams(searchParams);

	urlSearchParams.set("id", userId);

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_BY_USER_ID_ANIMALS_FILTER_OPTIONS}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { availableOptions, selectedOptions, shelters },
	} = result;

	return { availableOptions, selectedOptions, shelters };
};

export const query_getProfileAnimalsFilter = ({ searchParams, userId }: FetchProps) => {
	return useQuery({
		queryKey: ["profile-animals-filter", JSON.stringify(searchParams), userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async () => queryFn({ userId, searchParams }),
	});
};
export const prefetchQuery_getProfileAnimalsFilter = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["profile-animals-filter", JSON.stringify(searchParams), userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async () => queryFn({ userId, searchParams }),
	});

	return queryClient;
};

export const queryGetProfileAnimalsFilterInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-animals-filter", searchParams, userId] });
};
