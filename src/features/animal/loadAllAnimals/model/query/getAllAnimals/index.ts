// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// shared
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { API_GET_ANIMALS_BY_PAGE } from "@/shared/constants/routes";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-all-animals-by-page/route";

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

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMALS_BY_PAGE}/?${urlSearchParams}`, {
		method: "GET",
	});
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

export const infiniteQuery_getAllAnimals = ({ searchParams }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["all-animals", JSON.stringify(searchParams)],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam }) => queryFn({ pageParam, searchParams }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => (lastPage ? (lastPage.isHasMore ? lastPageParam + 1 : undefined) : undefined),
	});
};

export const prefetchInfiniteQuery_getAllAnimals = async ({ searchParams, queryClient }: PrefetchProps) => {
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-animals", JSON.stringify(searchParams)],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam }) => queryFn({ pageParam, searchParams }),
		initialPageParam: 1,
	});

	return queryClient;
};
