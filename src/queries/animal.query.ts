/* eslint-disable react-hooks/rules-of-hooks */
// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";

type Props = {
	animalId: string;
};

export const queryAnimal = ({ animalId }: Props) => {
	return useQuery({
		queryKey: ["animal", animalId],
		queryFn: async () => {
			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.set("id", animalId);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animal-by-id/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);
				const { ok } = response;
				if (ok) {
					const data = await response.json();
					const { success } = data;
					if (success) {
						const { animal } = data;

						return animal;
					}
				}
				return null;
			} catch (_) {
				return null;
			}
		},
	});
};

export const queryPrefetchAnimal = async ({ animalId }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["animal", animalId],
		queryFn: async () => {
			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.set("id", animalId);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animal-by-id/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);
				const { ok } = response;
				if (ok) {
					const data = await response.json();
					const { success } = data;

					if (success) {
						const { animal } = data;

						return animal;
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
