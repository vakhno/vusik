// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";

type Props = {
	shelterId: string;
};

export const queryShelter = ({ shelterId }: Props) => {
	return useQuery({
		queryKey: ["shelter", shelterId],
		queryFn: async () => {
			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.set("id", shelterId);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelter-by-id/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);
				const { ok } = response;
				if (ok) {
					const data = await response.json();
					const { success } = data;
					if (success) {
						const { shelter } = data;

						return shelter;
					}
				}
				return null;
			} catch (_) {
				return null;
			}
		},
	});
};

export const queryPrefetchShelter = async ({ shelterId }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["shelter", shelterId],
		queryFn: async () => {
			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.set("id", shelterId);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelter-by-id/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);
				const { ok } = response;
				if (ok) {
					const data = await response.json();
					const { success } = data;

					if (success) {
						const { shelter } = data;

						return shelter;
					}
				}
				return null;
			} catch (_) {
				return null;
			}
		},
	});

	return queryClient;
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
