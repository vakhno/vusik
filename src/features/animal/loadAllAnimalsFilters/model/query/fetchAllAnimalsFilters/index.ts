// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/animal/loadAllAnimalsFilters/api/getAllAnimalsFilters";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS } from "@/routes";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type FetchResult = Omit<SuccessResponse, "success"> | null;

const fetchData = async (searchParams: SearchParamsType): Promise<FetchResult> => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { availableOptions, selectedOptions } = data;

				return { availableOptions: availableOptions, selectedOptions: selectedOptions };
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

export const queryGetAllAnimalsFilter = ({ searchParams }: FetchProps) => {
	return useQuery({
		queryKey: ["all-animals-filter", searchParams],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async (): Promise<FetchResult> => {
			return fetchData(searchParams);
		},
	});
};

export const queryPrefetchGetAllAnimalsFilter = async ({ searchParams }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-animals-filter", searchParams],
		queryFn: async (): Promise<FetchResult> => {
			return fetchData(searchParams);
		},
	});

	return queryClient;
};

export const queryGetAllAnimalsFilterInvalidate = ({ queryClient, searchParams }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-animals-filter", searchParams] });
};
