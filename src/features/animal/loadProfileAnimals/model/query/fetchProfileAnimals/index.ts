// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// shared
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { API_GET_BY_USER_ID_ANIMALS_BY_PAGE } from "@/shared/constants/routes";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { SearchParamsType } from "@/shared/types/searchParams.type";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-profile-animals-by-page/route";

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
	userId: string;
	searchParams: SearchParamsType;
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

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_BY_USER_ID_ANIMALS_BY_PAGE}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { animals, isHasMore },
	} = result;

	return { animals: animals, isHasMore: isHasMore };
};

export const queryGetProfileAnimals = ({ searchParams, userId }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["profile-animals", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => queryFn({ userId, pageParam, searchParams }),
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};
export const prefetchQuery_getProfileAnimals = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-animals", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		initialPageParam: 1,
		queryFn: async ({ pageParam }) => queryFn({ userId, pageParam, searchParams }),
	});

	return queryClient;
};

export const queryGetProfileAnimalsInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-animals", searchParams, userId] });
};
