import { useContext } from "react";
import SpeciesContext from "@/zustand/context/species.context";
import { useStore } from "zustand";
import { SpeciesState } from "@/zustand/slice/species.slice";

const SpeciesStore = <T>(selector: (state: SpeciesState) => T): T => {
	const store = useContext(SpeciesContext);
	if (!store) {
		throw new Error("SpeciesStore must be used within a SepciesProvider");
	}
	return useStore(store, selector);
};

export default SpeciesStore;
