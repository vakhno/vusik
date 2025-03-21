// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-by-user-id-shelters-by-page/route";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// routes
// import { API_GET_BY_USER_ID_ANIMALS_BY_PAGE } from "@/routes";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

const fetchShelterssByProfileId = async (id: string | Types.ObjectId, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		urlSearchParams.set("id", String(id));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelters-by-user-id/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { shelters } = data;

				return { shelters: shelters };
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

const fetchData = async ({ id, searchParams }: { id: string | Types.ObjectId; searchParams: SearchParamsType }) => {
	const shelters = await fetchShelterssByProfileId(id, searchParams);

	if (shelters) {
		// const [sheltersData, sheltersData] = await Promise.all([
		//     fetchSheltersByUserId(userId),
		//     fetchSheltersByUserId(userId),
		// ]);
		// if (sheltersData && sheltersData) {
		return shelters;
		// }
	}
	return null;
};

export const queryGetAllProfileShelters = ({ searchParams, id }: Props) => {
	return useQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["all-profile-shelters", searchParams, id],
		queryFn: async (): Promise<{ shelters: ShelterType[] } | null> => {
			return fetchData({ id, searchParams });
		},
	});
};

export const queryPrefetchAllProfileShelters = async ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["all-profile-shelters", searchParams, id],
		queryFn: async () => {
			return fetchData({ id, searchParams });
		},
	});

	return queryClient;
};

export const queryGetAllProfileSheltersInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-profile-shelters", searchParams, id] });
};
