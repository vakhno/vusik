// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/shared/utils/searchParams";
// features
import { SuccessResponse, ErrorResponse } from "@/features/animal/loadProfileAnimals/api/getProfileAnimals";
// entities
import { AnimalType } from "@/entities/animal/model/type/animal";
// mongoose
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// routes
import { API_GET_BY_USER_ID_ANIMALS_BY_PAGE } from "@/shared/constants/routes";

const fetchData = async (id: string | Types.ObjectId, page: number, searchParams: SearchParamsType) => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);

		urlSearchParams.set("page", String(page));
		urlSearchParams.set("id", String(id));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_BY_USER_ID_ANIMALS_BY_PAGE}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { animals, isHasMore } = data;

				return { animals: animals, isHasMore: isHasMore };
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

export const queryGetProfileAnimals = ({ searchParams, id }: FetchProps) => {
	return useInfiniteQuery({
		queryKey: ["profile-animals", searchParams, id],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }): Promise<{ animals: AnimalType[]; isHasMore: boolean } | null> => {
			return fetchData(id, pageParam, searchParams);
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};
export const queryPrefetchGetProfileAnimals = async ({ searchParams, id }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-animals", searchParams, id],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData(id, pageParam, searchParams);
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileAnimalsInvalidate = ({ queryClient, searchParams, id }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["profile-animals", searchParams, id] });
};
