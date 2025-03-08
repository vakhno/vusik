// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/article/loadAllArticlesFilters/api/getAllArticlesFilters";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_ARTICLES } from "@/routes";
// types
import { SearchParamsType } from "@/types/searchParams.type";

const fetchData = async (searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_ARTICLES}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data as SuccessResponse | ErrorResponse;

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

export const queryGetAllArticlesFilter = ({ searchParams }: FetchProps) => {
	return useQuery({
		queryKey: ["all-articles-filter", searchParams],
		queryFn: async () => {
			return fetchData(searchParams);
		},
	});
};

export const queryPrefetchGetAllArticlesFilter = async ({ searchParams }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-articles-filter", searchParams],
		queryFn: async () => {
			return fetchData(searchParams);
		},
	});

	return queryClient;
};

export const queryGetAllArticlesFilterInvalidate = ({ queryClient, searchParams }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-articles-filter", searchParams] });
};
