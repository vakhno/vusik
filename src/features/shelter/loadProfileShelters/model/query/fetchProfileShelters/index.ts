// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/features/shelter/loadProfileShelters/api/getProfileShelters";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

const fetchData = async ({ userId, page, searchParams }: { userId: string; searchParams: SearchParamsType; page: number }) => {
	try {
		const urlSearchParams = convertObjectToURLSearchParams(searchParams);

		urlSearchParams.set("page", String(page));
		urlSearchParams.set("id", userId);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-by-user-id-shelters-by-page/?${urlSearchParams}`, {
			method: "GET",
		});

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

export const queryGetProfileShelters = ({ searchParams, userId }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["profile-shelters", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }): Promise<{ shelters: ShelterType[]; isHasMore: boolean } | null> => {
			return fetchData({ userId, searchParams, page: pageParam });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const prefetchQuery_getProfileShelters = async ({ searchParams, userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-shelters", searchParams, userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData({ userId, searchParams, page: pageParam });
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileSheltersInvalidate = ({ queryClient, searchParams, userId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-shelters", searchParams, userId] });
};
