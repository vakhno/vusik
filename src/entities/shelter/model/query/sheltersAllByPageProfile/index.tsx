// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/shelter/get-by-user-id-shelters-by-page/route";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// routes
// import { API_GET_BY_USER_ID_ANIMALS_BY_PAGE } from "@/routes";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

const fetchShelterssByProfileIdPerPage = async (
	id: string | Types.ObjectId,
	page: number,
	searchParams: SearchParamsType,
) => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);

		urlSearchParams.set("page", String(page));
		urlSearchParams.set("id", String(id));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-by-user-id-shelters-by-page/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResult | ErrorResult;
			const { success } = data;

			if (success) {
				const { shelters, isHasMore } = data;

				return { shelters: shelters, isHasMore: isHasMore };
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

const fetchData = async ({
	id,
	page,
	searchParams,
}: {
	id: string | Types.ObjectId;
	searchParams: SearchParamsType;
	page: number;
}) => {
	const shelters = await fetchShelterssByProfileIdPerPage(id, page, searchParams);

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

export const queryGetProfileShelters = ({ searchParams, id }: Props) => {
	return useInfiniteQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-shelters", searchParams, id],
		queryFn: async ({ pageParam = 1 }): Promise<{ shelters: ShelterType[]; isHasMore: boolean } | null> => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetProfileShelters = async ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-shelters", searchParams, id],
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileSheltersInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["profile-shelters", searchParams, id] });
};
