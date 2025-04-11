// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-all-shelters-filters/route";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

const fetchData = async (userId: string, searchParams: SearchParamsType) => {
	searchParams.id = String(userId);

	const urlSearchParams = convertObjectToURLSearchParams(searchParams);
	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-profile-animals-filters/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { availableOptions, shelters, selectedOptions },
	} = result;

	return { availableOptions, shelters, selectedOptions };
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

export const query_getProfileSheltersFilter = ({ searchParams, userId }: FetchProps) => {
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
