// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
import { Types } from "mongoose";

type Props = {
	animalId: Types.ObjectId;
};

const fetchAnimalById = async (animalId: string | Types.ObjectId) => {
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
};

const fetchShelterById = async (shelterId: string | Types.ObjectId) => {
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
};

const fetchUserById = async (userId: string | Types.ObjectId) => {
	try {
		const id = String(userId);
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.set("id", id);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/user/get-user-by-id/?${urlSearchParams}`,
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

const fetchData = async (animalId: string | Types.ObjectId) => {
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

export const queryAnimal = ({ animalId }: Props) => {
	return useQuery({
		queryKey: ["animal", animalId],
		queryFn: async () => {
			return await fetchData(animalId);
		},
	});
};

export const queryPrefetchAnimal = async ({ animalId }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["animal", animalId],
		queryFn: async () => {
			return await fetchData(animalId);
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
