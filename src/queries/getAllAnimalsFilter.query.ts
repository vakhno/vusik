// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/animal/get-filter-options-for-all-animals/route";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS } from "@/routes";

type Props = {
	searchParams: Record<string, string | string[]>;
};

type QueryResult = Omit<SuccessResult, "success"> | null;

type PrefetchResult = Omit<SuccessResult, "success"> | null;

export const queryGetAllAnimalsFilter = ({ searchParams }: Props) => {
	return useQuery({
		queryKey: ["all-animals-filter", searchParams],
		queryFn: async (): Promise<QueryResult> => {
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

export const queryPrefetchGetAllAnimalsFilter = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-animals-filter", searchParams],
		queryFn: async (): Promise<PrefetchResult> => {
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

export const queryGetAllAnimalsFilterInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-animals-filter", searchParams] });
};
