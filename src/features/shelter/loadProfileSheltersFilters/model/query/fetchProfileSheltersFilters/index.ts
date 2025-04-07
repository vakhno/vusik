// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-all-shelters-filters/route";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { Types } from "mongoose";

const fetchData = async (id: string | Types.ObjectId, searchParams: SearchParamsType) => {
	try {
		searchParams.id = String(id);

		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-profile-animals-filters/?${urlSearchParams}`,
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
	id: Types.ObjectId;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
	id: Types.ObjectId;
};

export const queryGetProfileSheltersFilter = ({ searchParams, id }: FetchProps) => {
	return useQuery({
		queryKey: ["profile-shelters-filter", searchParams, id],
		queryFn: async () => {
			return fetchData(id, searchParams);
		},
	});
};

export const queryPrefetchGetProfileSheltersFilter = async ({ searchParams, id }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["profile-shelters-filter", searchParams, id],
		queryFn: async () => {
			return fetchData(id, searchParams);
		},
	});

	return queryClient;
};

export const queryGetProfileSheltersFilterInvalidate = ({ queryClient, searchParams, id }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-shelters-filter", searchParams, id] });
};
