// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// features
import { SuccessResponse, ErrorResponse } from "@/features/animal/loadProfileAnimalsFilters/api/getProfileAnimalsFilters";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

const fetchData = async (userId: string, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		urlSearchParams.set("id", String(userId));

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-profile-animals-filters/?${urlSearchParams}`, {
			method: "GET",
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data as SuccessResponse | ErrorResponse;

			if (success) {
				const { availableOptions, selectedOptions } = data;

				return { availableOptions, selectedOptions };
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

type PrefetchProps = {
	searchParams: SearchParamsType;
	userId: string;
	queryClient: QueryClient;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
	userId: string;
};

export const queryGetProfileAnimalsFilter = ({ searchParams, userId }: FetchProps) => {
	return useQuery({
		queryKey: ["profile-animals-filter", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async () => {
			return fetchData(userId, searchParams);
		},
	});
};
export const queryPrefetchGetProfileAnimalsFilter = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["profile-animals-filter", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async () => {
			return fetchData(userId, searchParams);
		},
	});

	return queryClient;
};

export const queryGetProfileAnimalsFilterInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-animals-filter", searchParams, userId] });
};
