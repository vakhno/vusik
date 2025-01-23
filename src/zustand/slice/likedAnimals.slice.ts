import { createStore } from "zustand";
import { devtools, persist, StorageValue } from "zustand/middleware";
import { AnimalType } from "@/entities/animal/model/type";

interface LikedAnimalsValues {
	likedAnimals: Map<string, AnimalType>;
}

export interface LikedAnimalsState extends LikedAnimalsValues {
	handleAnimalLike: (value: AnimalType) => void;
}

const customStorage = {
	getItem: (name: string) => {
		const store = localStorage.getItem(name);
		if (!store) {
			return null;
		}
		const existingValue = JSON.parse(store);
		return {
			...existingValue,
			state: {
				...existingValue.state,
				likedAnimals: new Map(existingValue.state.likedAnimals),
			},
		};
	},
	setItem: (name: string, newValue: StorageValue<LikedAnimalsValues>) => {
		const store = JSON.stringify({
			...newValue,
			state: {
				...newValue.state,
				likedAnimals: Array.from(newValue.state.likedAnimals.entries()),
			},
		});
		localStorage.setItem(name, store);
	},
	removeItem: (name: string) => localStorage.removeItem(name),
};

const LikedAnimalsSlice = () =>
	createStore<LikedAnimalsState>()(
		persist(
			devtools((set, get) => ({
				likedAnimals: new Map(),
				handleAnimalLike: (likedAnimal: AnimalType) => {
					const likedAnimals = new Map(get().likedAnimals);
					const { _id: likedAnimalId } = likedAnimal;
					const isAnimalAlreadyLiked = likedAnimals.size && likedAnimals.has(String(likedAnimalId));
					if (isAnimalAlreadyLiked) {
						likedAnimals.delete(String(likedAnimalId));
					} else {
						likedAnimals.set(String(likedAnimalId), likedAnimal);
					}
					set({ likedAnimals: likedAnimals });
				},
			})),
			{
				name: "LikedAnimalsSlice",
				storage: customStorage,
			},
		),
	);

export default LikedAnimalsSlice;
