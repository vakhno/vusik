// tanstack
import { useInfiniteQuery, QueryClient, dehydrate } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/article/get-articles-by-page/route";
//routes
import { API_GET_ARTICLES_BY_PAGE } from "@/routes";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

type QueryResult = Omit<SuccessResponse, "success"> | null;

type PrefetchResult = Omit<SuccessResponse, "success"> | null;

export const queryGetAllArticles = ({ searchParams }: Props) => {
	return useInfiniteQuery({
		queryKey: ["all-articles", searchParams],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam }): Promise<QueryResult> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

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
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetAllArticles = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-articles", searchParams],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		// gcTime: 0, // cache disabled
		queryFn: async ({ pageParam }): Promise<PrefetchResult> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

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
		},
		initialPageParam: 1,
	});

	return dehydrate(queryClient);
	// return queryClient;
};

export const queryGetAllArticlesInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-articles", searchParams] });
};
