// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResult, ErrorResult } from "@/app/api/animal/get-animals-by-page/route";
import { AnimalType } from "@/types/animal.type";
import { Types } from "mongoose";

type Props = {
	searchParams: Record<string, string | string[]>;
	id: Types.ObjectId;
};

export const queryGetProfileAnimals = ({ searchParams, id }: Props) => {
	return useInfiniteQuery({
		queryKey: ["profile-animals", searchParams, id],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam = 1 }): Promise<{ animals: AnimalType[]; isHasMore: boolean } | null> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));
				urlSearchParams.set("id", String(id));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animals-by-page/?${urlSearchParams}`,
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
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));
				urlSearchParams.set("id", String(id));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animals-by-page/?${urlSearchParams}`,
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
				return [];
			} catch (_) {
				return [];
			}
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetProfileAnimalsInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["profile-animals", searchParams, id] });
};
