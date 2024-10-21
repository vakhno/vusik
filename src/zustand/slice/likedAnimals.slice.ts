import { createStore } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export interface LikedAnimalsState {
	likedAnimals: string[];
	handleAnimalLike: (value: string) => void;
	handleAnimalUnlike: (value: string) => void;
}

const LikedAnimalsSlice = () =>
	createStore<LikedAnimalsState>()(
		persist(
			devtools((set, get) => ({
				likedAnimals: [],
				handleAnimalLike: (animalId: string) => {
					const updatedLikedAnimals = [...get().likedAnimals, animalId];
					set({ likedAnimals: updatedLikedAnimals });
				},
				handleAnimalUnlike: (animalId: string) => {
					const updatedLikedAnimals = get().likedAnimals.filter(
						(likedAnimalId: string) => likedAnimalId !== animalId,
					);
					set({ likedAnimals: updatedLikedAnimals });
				},
			})),
			{ name: "LikedAnimalsSlice", storage: createJSONStorage(() => sessionStorage) },
		),
	);

export default LikedAnimalsSlice;
