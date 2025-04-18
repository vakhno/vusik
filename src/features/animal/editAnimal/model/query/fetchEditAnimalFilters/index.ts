// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse as SheltersSuccessResponse, ErrorResponse as SheltersErrorResponse } from "@/app/api/shelter/get-shelters-by-user-id/route";
import { SuccessResponse as AnimalSuccessResponse, ErrorResponse as AnimalErrorResponse } from "@/app/api/animal/get-animal-by-id/route";
// routes
import { API_GET_ANIMAL_BY_ID } from "@/shared/constants/routes";
// mongoose
import { Types } from "mongoose";

const fetchData = async (animalId: string | Types.ObjectId) => {
	try {
		const animalUrlSearchParams = new URLSearchParams();

		animalUrlSearchParams.set("id", String(animalId));
		let selectedOptions = null;
		let availableOptions = null;

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMAL_BY_ID}/?${animalUrlSearchParams}`, {
			method: "GET",
		});

		const result = (await response.json()) as AnimalSuccessResponse | AnimalErrorResponse;
		const { success } = result;

		if (success) {
			const {
				data: { animal },
			} = result;

			selectedOptions = animal;
		}

		if (selectedOptions) {
			const sheltersUrlSearchParams = new URLSearchParams();

			sheltersUrlSearchParams.set("id", String(selectedOptions.userId));

			const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelters-by-user-id/?${sheltersUrlSearchParams}`, {
				method: "GET",
			});

			const { ok } = response;

			if (ok) {
				const data = (await response.json()) as SheltersSuccessResponse | SheltersErrorResponse;
				const { success } = data;

				if (success) {
					const { data: shelters } = data;

					availableOptions = { shelters };
				}
			}
		}
		return { availableOptions, selectedOptions };
	} catch (_) {
		return null;
	}
};

type FetchProps = {
	id: string;
};

type InvalidationProps = {
	id: string;
	queryClient: QueryClient;
};

export const queryGetEditAnimalFilter = ({ id }: FetchProps) => {
	return useQuery({
		queryKey: ["edit-animal-filter", String(id)],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async () => {
			return fetchData(id);
		},
	});
};

export const queryPrefetchGetEditAnimalFilter = async ({ id }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["edit-animal-filter", String(id)],
		queryFn: async () => {
			return fetchData(id);
		},
	});

	return queryClient;
};

export const queryGetNewAnimalFilterInvalidate = ({ queryClient, id }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["edit-animal-filter", String(id)] });
};
