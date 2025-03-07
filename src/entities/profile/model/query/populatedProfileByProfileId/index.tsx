// tanstack
import { useQuery, QueryClient, useQueryClient, useMutation } from "@tanstack/react-query";
import { Types } from "mongoose";

type Props = {
	userId: Types.ObjectId;
};

const fetchUserById = async (userId: string | Types.ObjectId) => {
	try {
		const id = String(userId);
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.set("id", id);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/user/get-populated-user-by-id/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);
		const { ok } = response;
		if (ok) {
			const data = await response.json();
			const { success } = data;
			if (success) {
				const { user } = data;

				return user;
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

const fetchData = async (userId: string | Types.ObjectId) => {
	const user = await fetchUserById(userId);

	if (user) {
		// const [sheltersData, animalsData] = await Promise.all([
		//     fetchSheltersByUserId(userId),
		//     fetchAnimalsByUserId(userId),
		// ]);
		// if (sheltersData && animalsData) {
		return user;
		// }
	}
	return null;
};

export const queryPopulatedProfile = ({ userId }: Props) => {
	return useQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["populated-profile", String(userId)],
		queryFn: () => fetchData(userId),
	});
};

export const queryPrefetchPopulatedProfile = async ({ userId }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryKey: ["populated-profile", userId],
		queryFn: () => fetchData(userId),
	});

	return queryClient;
};

export const queryPopulatedProfileMutation = ({ userId }: Props) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: Types.ObjectId) => fetchData(userId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["populated-profile", userId] });
		},
	});
};
