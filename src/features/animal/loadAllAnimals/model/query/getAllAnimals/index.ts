// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/shared/utils/searchParams";
//routes
import { API_GET_ANIMALS_BY_PAGE } from "@/shared/constants/routes";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// api
import { SuccessResponse, ErrorResponse } from "@/features/animal/loadAllAnimals/api/getAllAnimals";

const fetchData = async (page: number, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);

		urlSearchParams.set("page", String(page));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMALS_BY_PAGE}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { animals, isHasMore } = data;

				return { animals: animals, isHasMore: isHasMore };
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

type FetchProps = {
	searchParams: SearchParamsType;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
};

export const queryGetAllAnimals = ({ searchParams }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["all-animals", searchParams],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam }) => {
			return fetchData(pageParam, searchParams);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetAllAnimals = async ({ searchParams }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-animals", searchParams],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam }) => {
			return fetchData(pageParam, searchParams);
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetAllAnimalsInvalidate = ({ queryClient }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-animals"], exact: false });
};
