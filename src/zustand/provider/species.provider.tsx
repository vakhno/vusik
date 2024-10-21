"use client";
import { useRef, ReactNode } from "react";
import SpeciesSlice from "@/zustand/slice/species.slice";
import { SpeciesType } from "@/types/species.type";
import SpeciesContext from "@/zustand/context/species.context";

type Props = {
	preloadSpecies: SpeciesType[];
	children: ReactNode;
};

const SpeciesProvider = ({ preloadSpecies, children }: Props) => {
	const storeRef = useRef(SpeciesSlice(preloadSpecies));
	return <SpeciesContext.Provider value={storeRef.current}>{children}</SpeciesContext.Provider>;
};

export default SpeciesProvider;
