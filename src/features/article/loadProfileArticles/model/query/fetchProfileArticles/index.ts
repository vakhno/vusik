// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import { SuccessResponse, ErrorResponse } from "@/features/article/loadAllArticles/api/getAllArticles";

const fetchData = async (userId: string, page: number, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		urlSearchParams.set("page", String(page));
		urlSearchParams.set("id", userId);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/get-by-user-id-articles-by-page/?${urlSearchParams}`, {
			method: "GET",
		});

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
	userId: string;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
	userId: string;
};

export const queryGetProfileArticles = ({ searchParams, userId }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["profile-articles", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData(userId, pageParam, searchParams);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetProfileArticles = async ({ searchParams, userId }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-articles", searchParams, userId],
		gcTime: 0,
		queryFn: async ({ pageParam }) => {
			return fetchData(userId, pageParam, searchParams);
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileArticlesInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-articles", searchParams, userId] });
};
