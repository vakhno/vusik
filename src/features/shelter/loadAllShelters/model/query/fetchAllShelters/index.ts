// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { API_GET_SHELTERS_BY_PAGE } from "@/shared/constants/routes";
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-all-shelters-by-page/route";

type QueryFnProps = {
	pageParam: number;
	searchParams: SearchParamsType;
};

type FetchProps = {
	searchParams: SearchParamsType;
};

type PrefetchProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
};

const queryFn = async ({ pageParam, searchParams }: QueryFnProps) => {
	const urlSearchParams = convertObjectToURLSearchParams(searchParams);

	urlSearchParams.set("page", String(pageParam));

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_SHELTERS_BY_PAGE}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { shelters, isHasMore },
	} = result;

	return { shelters: shelters, isHasMore: isHasMore };
};

export const infiniteQuery_getAllShelters = ({ searchParams }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["all-shelters", JSON.stringify(searchParams)],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => queryFn({ pageParam, searchParams }),
		getNextPageParam: (lastPage, _, lastPageParam, __) => (lastPage ? (lastPage.isHasMore ? lastPageParam + 1 : undefined) : undefined),
	});
};

export const prefetchInfiniteQuery_getAllShelters = async ({ searchParams, queryClient }: PrefetchProps) => {
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-shelters", JSON.stringify(searchParams)],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => queryFn({ pageParam, searchParams }),
	});

	return queryClient;
};
