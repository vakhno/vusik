// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/shared/utils/searchParams";
//routes
import { API_GET_ARTICLES_BY_PAGE } from "@/shared/constants/routes";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// api
import { SuccessResponse, ErrorResponse } from "@/features/article/loadAllArticles/api/getAllArticles";

const fetchData = async (page: number, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);

		urlSearchParams.set("page", String(page));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ARTICLES_BY_PAGE}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { articles, isHasMore } = data;

				return { articles: articles, isHasMore: isHasMore };
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

export const queryGetAllArticles = ({ searchParams }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["all-articles", searchParams],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		refetchOnMount: false,
		refetchOnReconnect: false,
		queryFn: async ({ pageParam }) => {
			return fetchData(pageParam, searchParams);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetAllArticles = async ({ searchParams }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-articles", searchParams],
		gcTime: 0,
		queryFn: async ({ pageParam }) => {
			return fetchData(pageParam, searchParams);
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetAllArticlesInvalidate = ({ queryClient, searchParams }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-articles", searchParams] });
};
