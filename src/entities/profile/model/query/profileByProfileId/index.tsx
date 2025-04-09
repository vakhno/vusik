// tanstack
import { useQuery, QueryClient, useQueryClient, useMutation } from "@tanstack/react-query";
// shared
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { API_USER_GET_USER_BY_ID } from "@/shared/constants/routes";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/user/get-user-by-id/route";

type QueryFnProps = {
	userId: string;
};

type FetchProps = {
	userId: string;
};

type PrefetchProps = {
	userId: string;
	queryClient: QueryClient;
};

const queryFn = async ({ userId }: QueryFnProps) => {
	const urlSearchParams = new URLSearchParams();

	urlSearchParams.set("id", userId);

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_USER_GET_USER_BY_ID}/?${urlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		return null;
	}

	const {
		data: { user },
	} = result;

	return user;
};

export const query_getProfile = ({ userId }: FetchProps) => {
	return useQuery({
		queryKey: ["profile", userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => queryFn({ userId }),
	});
};
export const prefetchQuery_getProfile = async ({ userId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["profile", userId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => queryFn({ userId }),
	});

	return queryClient;
};

export const queryProfileMutation = ({ userId }: FetchProps) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (userId: string) => queryFn({ userId }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
		},
	});
};
