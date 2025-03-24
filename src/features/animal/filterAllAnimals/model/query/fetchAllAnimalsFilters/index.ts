// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/animal/filterAllAnimals/api/getAllAnimalsFilters";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS } from "@/shared/constants/routes";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

type FetchResult = Omit<SuccessResponse, "success"> | null;

const fetchData = async (searchParams: SearchParamsType): Promise<FetchResult> => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);
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
				const { availableOptions, shelters, selectedOptions } = data;

				return { availableOptions: availableOptions, shelters: shelters, selectedOptions: selectedOptions };
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

export const queryGetAllAnimalsFilter = ({ searchParams }: FetchProps) => {
	return useQuery({
		queryKey: ["all-animals-filter", JSON.stringify(searchParams)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async (): Promise<FetchResult> => {
			return fetchData(searchParams);
		},
	});
};

export const queryPrefetchGetAllAnimalsFilter = async ({ searchParams, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["all-animals-filter", JSON.stringify(searchParams)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async (): Promise<FetchResult> => {
			return fetchData(searchParams);
		},
	});

	return queryClient;
};
