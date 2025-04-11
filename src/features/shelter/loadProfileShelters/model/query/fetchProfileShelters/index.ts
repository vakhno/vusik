// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// shared
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { API_GET_BY_USER_ID_SHELTERS_BY_PAGE } from "@/shared/constants/routes";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-by-user-id-shelters-by-page/route";

type QueryFnProps = {
	userId: string;
	pageParam: number;
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

const queryFn = async ({ userId, pageParam, searchParams }: QueryFnProps) => {
	const urlSearchParams = convertObjectToURLSearchParams(searchParams);

	urlSearchParams.set("page", String(pageParam));
	urlSearchParams.set("id", userId);

	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_BY_USER_ID_SHELTERS_BY_PAGE}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { shelters, isHasMore },
	} = result;

	return { shelters, isHasMore };
};

export const queryGetProfileShelters = ({ searchParams, userId }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["profile-shelters", JSON.stringify(searchParams), userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => queryFn({ userId, pageParam, searchParams }),
		getNextPageParam: (lastPage, _, lastPageParam, __) => (lastPage ? (lastPage.isHasMore ? lastPageParam + 1 : undefined) : undefined),
	});
};

export const prefetchQuery_getProfileShelters = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-shelters", JSON.stringify(searchParams), userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => queryFn({ userId, pageParam, searchParams }),
	});

	return queryClient;
};

export const queryGetProfileSheltersInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-shelters", searchParams, userId] });
};
