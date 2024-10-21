/* eslint-disable react-hooks/rules-of-hooks */
// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// actions
import { urlSearchParamsBuilder } from "@/utils/searchParams";
import { SuccessResult, ErrorResult } from "@/app/api/animal/get-filter-options-for-all-animals/route";

type Props = {
	searchParams: Record<string, string | string[]>;
};

export const queryGetAllAnimalsFilter = ({ searchParams }: Props) => {
	return useQuery({
		queryKey: ["all-animals-filter", searchParams],
		queryFn: async () => {
			const urlSearchParams = urlSearchParamsBuilder(searchParams);
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-filter-options-for-all-animals/?${urlSearchParams}`,
				{
					method: "GET",
				},
			);

			const { ok } = response;

			if (ok) {
				const data = await response.json();
				const { success } = data as SuccessResult | ErrorResult;

				if (success) {
					const { availableOptions, selectedOptions } = data;

					return { availableOptions, selectedOptions };
				}
			}

			return {};
		},
	});
};

export const queryPrefetchGetAllAnimalsFilter = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-animals-filter", searchParams],
		queryFn: async () => {
			const urlSearchParams = urlSearchParamsBuilder(searchParams);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-filter-options-for-all-animals/?${urlSearchParams}`,
				{
					method: "GET",
				},
			);

			const { ok } = response;

			if (ok) {
				const data = await response.json();
				const { success } = data as SuccessResult | ErrorResult;

				if (success) {
					const { availableOptions, selectedOptions } = data;

					return { availableOptions, selectedOptions };
				}
			}

			return {};
		},
	});

	return queryClient;
};

export const queryGetAllAnimalsFilterInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-animals-filter", searchParams] });
};

// export const useQueryProfileMutation = ({ userId }: Props) => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: (userId: Types.ObjectId) => getUserById({ userId: userId }),
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
// 		},
// 	});
// };
