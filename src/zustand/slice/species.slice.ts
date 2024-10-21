import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { SpeciesType } from "@/types/species.type";

export interface SpeciesState {
	species: SpeciesType[] | null;
}

const SpeciesSlice = (initialState: SpeciesType[] | null = null) =>
	createStore<SpeciesState>()(
		devtools(
			() => ({
				species: initialState,
			}),
			{ name: "SpeciesSlice" },
		),
	);

export default SpeciesSlice;
