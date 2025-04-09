// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/article/loadAllArticlesFilters/api/getAllArticlesFilters";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

const fetchData = async (userId: string, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		urlSearchParams.set("id", userId);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/get-profile-animals-filters/?${urlSearchParams}`, {
			method: "GET",
		});

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
	userId: string;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
	userId: string;
};

export const queryGetProfileArticlesFilter = ({ searchParams, userId }: FetchProps) => {
	return useQuery({
		queryKey: ["profile-articles-filter", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async () => {
			return fetchData(userId, searchParams);
		},
	});
};

export const queryPrefetchGetProfileArticlesFilter = async ({ searchParams, userId }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["profile-articles-filter", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async () => {
			return fetchData(userId, searchParams);
		},
	});

	return queryClient;
};

export const queryGetProfileArticlesFilterInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-articles-filter", searchParams, userId] });
};
