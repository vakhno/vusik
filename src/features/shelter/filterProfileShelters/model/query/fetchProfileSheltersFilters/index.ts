// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { API_GET_BY_USER_ID_SHELTERS_FILTER_OPTIONS } from "@/shared/constants/routes";
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-profile-shelters-filters/route";

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

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_BY_USER_ID_SHELTERS_FILTER_OPTIONS}/?${urlSearchParams}`, { method: "GET" });
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

export const query_getProfileSheltersFilter = ({ searchParams, userId }: FetchProps) => {
	return useQuery({
		queryKey: ["profile-shelters-filter", JSON.stringify(searchParams), userId],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => queryFn({ userId, searchParams }),
	});
};

export const prefetchQuery_getProfileSheltersFilter = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["profile-shelters-filter", JSON.stringify(searchParams), userId],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => queryFn({ userId, searchParams }),
	});

	return queryClient;
};

export const queryGetProfileSheltersFilterInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-shelters-filter", searchParams, userId] });
};
