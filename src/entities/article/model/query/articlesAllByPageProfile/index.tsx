// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/article/get-by-user-id-articles-by-page/route";
import { ArticleType } from "@/entities/article/model/type/article";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

const fetchArticlesByProfileIdPerPage = async (
	id: string | Types.ObjectId,
	page: number,
	searchParams: SearchParamsType,
) => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);

		urlSearchParams.set("page", String(page));
		urlSearchParams.set("id", String(id));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/get-by-user-id-articles-by-page/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResult | ErrorResult;
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

const fetchData = async ({
	id,
	page,
	searchParams,
}: {
	id: string | Types.ObjectId;
	searchParams: SearchParamsType;
	page: number;
}) => {
	const articles = await fetchArticlesByProfileIdPerPage(id, page, searchParams);

	if (articles) {
		// const [sheltersData, animalsData] = await Promise.all([
		//     fetchSheltersByUserId(userId),
		//     fetchAnimalsByUserId(userId),
		// ]);
		// if (sheltersData && animalsData) {
		return articles;
		// }
	}
	return null;
};

export const queryGetProfileArticles = ({ searchParams, id }: Props) => {
	return useInfiniteQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-articles", searchParams, id],
		queryFn: async ({ pageParam = 1 }): Promise<{ articles: ArticleType[]; isHasMore: boolean } | null> => {
			return fetchData({ id, searchParams, page: pageParam });
			// try {
			// 	const urlSearchParams = urlSearchParamsBuilder(searchParams);

			// 	urlSearchParams.set("page", String(pageParam));
			// 	urlSearchParams.set("id", String(id));

			// 	const response = await fetch(
			// 		`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_BY_USER_ID_ANIMALS_BY_PAGE}/?${urlSearchParams}`,
			// 		{
			// 			method: "GET",
			// 		},
			// 	);

			// 	const { ok } = response;

			// 	if (ok) {
			// 		const data = (await response.json()) as SuccessResult | ErrorResult;
			// 		const { success } = data;

			// 		if (success) {
			// 			const { animals, isHasMore } = data;

			// 			return { animals: animals, isHasMore: isHasMore };
			// 		}
			// 	}
			// 	return null;
			// } catch (_) {
			// 	return null;
			// }
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetProfileArticles = async ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-articles", searchParams, id],
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileArticlesInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["profile-articles", searchParams, id] });
};
