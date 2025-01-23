// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/animal/get-by-user-id-animals-by-page/route";
import { AnimalType } from "@/entities/animal/model/type";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// routes
import { API_GET_BY_USER_ID_ANIMALS_BY_PAGE } from "@/routes";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

const fetchAnimalsByProfileIdPerPage = async (
	id: string | Types.ObjectId,
	page: number,
	searchParams: SearchParamsType,
) => {
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
			const data = (await response.json()) as SuccessResult | ErrorResult;
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

const fetchData = async ({
	id,
	page,
	searchParams,
}: {
	id: string | Types.ObjectId;
	searchParams: SearchParamsType;
	page: number;
}) => {
	const animals = await fetchAnimalsByProfileIdPerPage(id, page, searchParams);

	if (animals) {
		return animals;
	}
	return null;
};

export const queryGetProfileAnimals = ({ searchParams, id }: Props) => {
	return useInfiniteQuery({
		queryKey: ["profile-animals", searchParams, id],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam = 1 }): Promise<{ animals: AnimalType[]; isHasMore: boolean } | null> => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage?.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetProfileAnimals = async ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["profile-animals", searchParams, id],
		queryFn: async ({ pageParam = 1 }) => {
			return fetchData({ id, searchParams, page: pageParam });
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileAnimalsInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["profile-animals", searchParams, id] });
};
