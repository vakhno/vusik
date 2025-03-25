// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
//routes
import { API_GET_SHELTERS_BY_PAGE } from "@/shared/constants/routes";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// api
import { SuccessResponse, ErrorResponse } from "@/features/shelter/loadAllShelters/api/getAllShelters";

const fetchData = async (page: number, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		urlSearchParams.set("page", String(page));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_SHELTERS_BY_PAGE}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
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
};

type FetchProps = {
	searchParams: SearchParamsType;
};

type PrefetchProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
};

export const queryGetAllShelters = ({ searchParams }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["all-shelters", searchParams],
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

export const queryPrefetchGetAllShelters = async ({ searchParams, queryClient }: PrefetchProps) => {
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-shelters", searchParams],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam }) => {
			return fetchData(pageParam, searchParams);
		},
		initialPageParam: 1,
	});

	return queryClient;
};
