// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
import { Types } from "mongoose";
import {
	SuccessResponse as AnimalSuccessResponse,
	ErrorResponse as AnimalErrorResponse,
} from "@/app/api/animal/get-animal-by-id/route";
import {
	SuccessResponse as ShelterSuccessResponse,
	ErrorResponse as ShelterErrorResponse,
} from "@/app/api/shelter/get-shelter-by-id/route";
import {
	SuccessResponse as UserSuccessResponse,
	ErrorResponse as UserErrorResponse,
} from "@/app/api/user/get-populated-user-by-id/route";

const fetchAnimalById = async (animalId: Types.ObjectId) => {
	try {
		const id = String(animalId);
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.set("id", id);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animal-by-id/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);
		const { ok } = response;
		if (ok) {
			const data = (await response.json()) as AnimalSuccessResponse | AnimalErrorResponse;
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
};

const fetchShelterById = async (shelterId: Types.ObjectId) => {
	try {
		const id = String(shelterId);
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.set("id", id);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelter-by-id/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);
		const { ok } = response;
		if (ok) {
			const data = (await response.json()) as ShelterSuccessResponse | ShelterErrorResponse;
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
};

const fetchUserById = async (userId: Types.ObjectId) => {
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
			const data = (await response.json()) as UserSuccessResponse | UserErrorResponse;
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

const fetchData = async (animalId: Types.ObjectId) => {
	const animal = await fetchAnimalById(animalId);

	if (animal) {
		const { shelterId, userId } = animal;
		const [shelter, user] = await Promise.all([fetchShelterById(shelterId), fetchUserById(userId)]);
		if (shelter && user) {
			return { animal, shelter, user };
		}
	}
	return null;
};

type FetchProps = {
	animalId: Types.ObjectId;
};

export const queryAnimal = ({ animalId }: FetchProps) => {
	return useQuery({
		queryKey: ["animal", animalId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => fetchData(animalId),
	});
};

export const queryPrefetchAnimal = async ({ animalId }: FetchProps) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["animal", animalId],
		gcTime: 5 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		queryFn: () => fetchData(animalId),
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
