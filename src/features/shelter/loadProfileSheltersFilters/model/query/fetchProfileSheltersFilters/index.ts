// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-all-shelters-filters/route";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

const fetchData = async (userId: string, searchParams: SearchParamsType) => {
	try {
		searchParams.id = String(userId);

		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-profile-animals-filters/?${urlSearchParams}`, {
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

export const queryGetProfileSheltersFilter = ({ searchParams, userId }: FetchProps) => {
	return useQuery({
		queryKey: ["profile-shelters-filter", searchParams, userId],
		queryFn: async () => {
			return fetchData(userId, searchParams);
		},
	});
};

export const prefetchQuery_getProfileSheltersFilter = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["profile-shelters-filter", searchParams, userId],
		queryFn: async () => {
			return fetchData(userId, searchParams);
		},
	});

	return queryClient;
};

export const queryGetProfileSheltersFilterInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-shelters-filter", searchParams, userId] });
};
