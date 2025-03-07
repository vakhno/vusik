// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/shelter/loadProfileShelters/api/getAllShelters";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/types/searchParams.type";

const fetchData = async ({
	id,
	page,
	searchParams,
}: {
	id: string | Types.ObjectId;
	searchParams: SearchParamsType;
	page: number;
}) => {
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
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
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

type FetchProps = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

type InvalidationProps = {
	searchParams: SearchParamsType;
	queryClient: QueryClient;
	id: Types.ObjectId;
};

export const queryGetProfileShelters = ({ searchParams, id }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["profile-shelters", searchParams, id],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }): Promise<{ shelters: ShelterType[]; isHasMore: boolean } | null> => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetProfileShelters = async ({ searchParams, id }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-shelters", searchParams, id],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileSheltersInvalidate = ({ queryClient, searchParams, id }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-shelters", searchParams, id] });
};
