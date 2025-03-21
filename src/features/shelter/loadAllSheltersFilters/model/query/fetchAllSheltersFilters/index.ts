// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/shelter/loadAllSheltersFilters/api/getAllSheltersFilters";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS } from "@/shared/constants/routes";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

const fetchData = async (searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS}/?${urlSearchParams}`,
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

export const queryGetAllSheltersFilter = ({ searchParams }: FetchProps) => {
	return useQuery({
		queryKey: ["all-shelters-filter", searchParams],
		queryFn: async () => {
			return fetchData(searchParams);
		},
	});
};

export const queryPrefetchGetAllSheltersFilter = async ({ searchParams }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-shelters-filter", searchParams],
		queryFn: async () => {
			return fetchData(searchParams);
		},
	});

	return queryClient;
};

export const queryGetAllSheltersFilterInvalidate = ({ queryClient, searchParams }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-shelters-filter", searchParams] });
};
