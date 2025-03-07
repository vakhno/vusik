// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// actions
import { urlSearchParamsBuilder } from "@/utils/searchParams";
import { SuccessResult, ErrorResult } from "@/app/api/shelter/get-filter-options-for-all-shelters/route";
import { Types } from "mongoose";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
};

// type QueryResult = Omit<SuccessResult, "success"> | null;

// type PrefetchResult = Omit<SuccessResult, "success"> | null;

export const queryGetProfileSheltersFilter = ({ searchParams, id }: Props) => {
	return useQuery({
		queryKey: ["profile-shelters-filter", searchParams, id],
		queryFn: async () => {
			const urlSearchParams = urlSearchParamsBuilder(searchParams);

			urlSearchParams.set("id", String(id));

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-filter-options-for-all-shelters/?${urlSearchParams}`,
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

			return null;
		},
	});
};

export const queryPrefetchGetProfileSheltersFilter = async ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["profile-shelters-filter", searchParams, id],
		queryFn: async () => {
			const urlSearchParams = urlSearchParamsBuilder(searchParams);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-filter-options-for-all-shelters/?${urlSearchParams}`,
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

			return null;
		},
	});

	return queryClient;
};

export const queryGetProfileSheltersFilterInvalidate = ({ searchParams, id }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["profile-shelters-filter", searchParams, id] });
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
