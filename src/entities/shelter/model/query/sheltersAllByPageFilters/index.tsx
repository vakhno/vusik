// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/shelter/get-filter-options-for-all-shelters/route";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS } from "@/routes";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

// type QueryResult = Omit<SuccessResult, "success"> | null;

// type PrefetchResult = Omit<SuccessResult, "success"> | null;

export const queryGetAllSheltersFilter = ({ searchParams }: Props) => {
	return useQuery({
		queryKey: ["all-shelters-filter", searchParams],
		queryFn: async () => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS}/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);

				const { ok } = response;

				if (ok) {
					const data = await response.json();
					const { success } = data as SuccessResult | ErrorResult;

					if (success) {
						const { availableOptions, selectedOptions } = data;

						return { availableOptions: availableOptions, selectedOptions: selectedOptions };
					}
				}

				return null;
			} catch (_) {
				return null;
			}
		},
	});
};

export const queryPrefetchGetAllSheltersFilter = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-shelters-filter", searchParams],
		queryFn: async () => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS}/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);

				const { ok } = response;

				if (ok) {
					const data = await response.json();
					const { success } = data as SuccessResult | ErrorResult;

					if (success) {
						const { availableOptions, selectedOptions } = data;

						return { availableOptions: availableOptions, selectedOptions: selectedOptions };
					}
				}

				return null;
			} catch (_) {
				return null;
			}
		},
	});

	return queryClient;
};

export const queryGetAllSheltersFilterInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-shelters-filter", searchParams] });
};
