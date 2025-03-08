// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// actions
import { urlSearchParamsBuilder } from "@/utils/searchParams";
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-all-animals-filters/route";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

export const queryGetProfileAnimalsFilter = ({ searchParams, id }: Props) => {
	return useQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-animals-filter", searchParams, id],
		queryFn: async () => {
			const urlSearchParams = urlSearchParamsBuilder(searchParams);

			urlSearchParams.set("id", String(id));

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-all-animals-filters/?${urlSearchParams}`,
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

					return { availableOptions, selectedOptions };
				}
			}

			return {};
		},
	});
};
export const queryPrefetchGetProfileAnimalsFilter = async ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-animals-filter", searchParams, id],
		queryFn: async () => {
			const urlSearchParams = urlSearchParamsBuilder(searchParams);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-all-animals-filters/?${urlSearchParams}`,
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

					return { availableOptions, selectedOptions };
				}
			}

			return {};
		},
	});

	return queryClient;
};

export const queryGetProfileAnimalsFilterInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["profile-animals-filter", searchParams, id] });
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
