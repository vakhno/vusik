/* eslint-disable react-hooks/rules-of-hooks */
// tanstack
import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-animals-by-page/route";

type Props = {
	searchParams: Record<string, string | string[]>;
};

export const queryGetAllAnimals = ({ searchParams }: Props) => {
	return useInfiniteQuery({
		queryKey: ["all-animals", searchParams],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam }): Promise<Omit<SuccessResponse, "success">> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animals-by-page/?${urlSearchParams}`,
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
				return { animals: [], isHasMore: false };
			} catch (_) {
				return { animals: [], isHasMore: false };
			}
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, _, lastPageParam, __) => {
			return lastPage.isHasMore ? lastPageParam + 1 : undefined;
		},
	});
};

export const queryPrefetchGetAllAnimals = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["all-animals", searchParams],
		gcTime: 0, // cache disabled
		queryFn: async ({ pageParam }): Promise<Omit<SuccessResponse, "success">> => {
			try {
				const urlSearchParams = urlSearchParamsBuilder(searchParams);

				urlSearchParams.set("page", String(pageParam));

				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animals-by-page/?${urlSearchParams}`,
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
				return { animals: [], isHasMore: false };
			} catch (_) {
				return { animals: [], isHasMore: false };
			}
		},
		initialPageParam: 1,
	});

	return queryClient;
};

export const queryGetAllAnimalsInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-animals", searchParams] });
};

// export const useQueryMainMutation = ({ searchParams }: Props) => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: (userId: Types.ObjectId) => getUserProfileDataById(),
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["all-animals"] });
// 		},
// 	});
// };
