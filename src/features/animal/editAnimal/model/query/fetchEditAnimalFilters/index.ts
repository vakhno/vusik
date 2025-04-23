// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// api
import { SuccessResponse as SheltersSuccessResponse, ErrorResponse as SheltersErrorResponse } from "@/app/api/shelter/get-shelters-by-user-id/route";
import { SuccessResponse as AnimalSuccessResponse, ErrorResponse as AnimalErrorResponse } from "@/app/api/animal/get-animal-by-id/route";
// routes
import { API_GET_ANIMAL_BY_ID } from "@/shared/constants/routes";
import {NEXT_PUBLIC_ACTIVE_DOMEN} from '@/shared/constants/env'

type QueryFnProps = {
	animalId: string;
};

type FetchProps = {
	animalId: string;
};

type InvalidationProps = {
	animalId: string;
	queryClient: QueryClient;
};

type PrefetchProps = {
	animalId: string;
	queryClient: QueryClient;
};

const queryFn = async ({ animalId }: QueryFnProps) => {
	try {
		const animalUrlSearchParams = new URLSearchParams();

		animalUrlSearchParams.set("id", animalId);
		let selectedOptions = null;
		let availableOptions = null;

		const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMAL_BY_ID}/?${animalUrlSearchParams}`, {
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

			const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelters-by-user-id/?${sheltersUrlSearchParams}`, {
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

export const query_getEditAnimalFilter = ({ animalId }: FetchProps) => {
	return useQuery({
		queryKey: ["edit-animal-filter", animalId],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: () => queryFn({ animalId }),
	});
};

export const prefetchQuery_getEditAnimalFilter = async ({ animalId, queryClient }: PrefetchProps) => {
	await queryClient.prefetchQuery({
		queryKey: ["edit-animal-filter", animalId],
		queryFn: () => queryFn({ animalId }),
	});

	return queryClient;
};

export const queryGetNewAnimalFilterInvalidate = ({ queryClient, animalId }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["edit-animal-filter", animalId] });
};
