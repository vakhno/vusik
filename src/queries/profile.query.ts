/* eslint-disable react-hooks/rules-of-hooks */
// tanstack
import { useQuery, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
// actions
import { getUserById } from "@/actions/user/getUserById";
// mongoose
import { Types } from "mongoose";

type Props = {
	userId: Types.ObjectId;
};

export const queryProfile = ({ userId }: Props) => {
	return useQuery({
		queryKey: ["profile", String(userId)],
		queryFn: () => getUserById({ userId: userId }),
	});
};

export const queryPrefetchProfile = async ({ userId }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["profile", userId],
		queryFn: () => getUserById({ userId: userId }),
	});

	return queryClient;
};

export const queryProfileMutation = ({ userId }: Props) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: Types.ObjectId) => getUserById({ userId: userId }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
		},
	});
};
