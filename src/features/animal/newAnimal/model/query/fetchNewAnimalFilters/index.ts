// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/shelter/get-by-user-id-shelters-by-page/route";
// mongoose
import { Types } from "mongoose";

const fetchData = async (id: string | Types.ObjectId) => {
	try {
		const urlSearchParams = new URLSearchParams();

		urlSearchParams.set("id", String(id));

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelters-by-user-id/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = (await response.json()) as SuccessResponse | ErrorResponse;
			const { success } = data;

			if (success) {
				const { shelters } = data;

				return { availableOptions: { shelters } };
			}
		}
		return null;
	} catch (_) {
		return null;
	}
};

type FetchProps = {
	id: Types.ObjectId;
};

type InvalidationProps = {
	id: Types.ObjectId;
	queryClient: QueryClient;
};

export const queryGetNewAnimalFilter = ({ id }: FetchProps) => {
	return useQuery({
		queryKey: ["new-animal-filter", String(id)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => {
			return fetchData(id);
		},
	});
};

export const queryPrefetchGetNewAnimalFilter = async ({ id }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["new-animal-filter", String(id)],
		queryFn: async () => {
			return fetchData(id);
		},
	});

	return queryClient;
};

export const queryGetNewAnimalFilterInvalidate = ({ queryClient, id }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["new-animal-filter", String(id)] });
};
