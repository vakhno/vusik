// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/shelter/get-shelters-by-page/route";
//routes
import { API_GET_SHELTERS_BY_PAGE } from "@/routes";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

type QueryResult = Omit<SuccessResult, "success"> | null;

type PrefetchResult = Omit<SuccessResult, "success"> | null;

export const queryGetAllShelters = ({ searchParams }: Props) => {
	return useInfiniteQuery({
		queryKey: ["all-shelters", searchParams],
		// gcTime: 5 * 60 * 1000, // cache disabled
		// staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam }): Promise<QueryResult> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_SHELTERS_BY_PAGE}/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);

				const { ok } = response;

				if (ok) {
					const data = (await response.json()) as SuccessResult | ErrorResult;
					const { success } = data;

					if (success) {
						const { shelters, isHasMore } = data;

						return { shelters: shelters, isHasMore: isHasMore };
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

export const queryPrefetchGetAllShelters = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-shelters", searchParams],

		gcTime: 0, // cache disabled
		// gcTime: 5 * 60 * 1000, // cache disabled
		staleTime: 5 * 60 * 1000,

		queryFn: async ({ pageParam }): Promise<PrefetchResult> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_SHELTERS_BY_PAGE}/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);

				const { ok } = response;

				if (ok) {
					const data = (await response.json()) as SuccessResult | ErrorResult;
					const { success } = data;

					if (success) {
						const { shelters, isHasMore } = data;

						return { shelters: shelters, isHasMore: isHasMore };
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

export const queryGetAllSheltersInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-shelters", searchParams] });
};
