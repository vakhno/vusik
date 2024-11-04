// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/animal/get-animals-by-page/route";
//routes
import { API_GET_ANIMALS_BY_PAGE } from "@/routes";

type Props = {
	searchParams: Record<string, string | string[]>;
};

type QueryResult = Omit<SuccessResult, "success"> | null;

type PrefetchResult = Omit<SuccessResult, "success"> | null;

export const queryGetAllAnimals = ({ searchParams }: Props) => {
	return useInfiniteQuery({
		queryKey: ["all-animals", searchParams],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam }): Promise<QueryResult> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMALS_BY_PAGE}/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);

				const { ok } = response;

				if (ok) {
					const data = (await response.json()) as SuccessResult | ErrorResult;
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
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetAllAnimals = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-animals", searchParams],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam }): Promise<PrefetchResult> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMALS_BY_PAGE}/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);

				const { ok } = response;

				if (ok) {
					const data = (await response.json()) as SuccessResult | ErrorResult;
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
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetAllAnimalsInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-animals", searchParams] });
};
