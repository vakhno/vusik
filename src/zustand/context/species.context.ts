import { createContext } from "react";
import SpeciesSlice from "@/zustand/slice/species.slice";

const SpeciesContext = createContext<ReturnType<typeof SpeciesSlice> | null>(null);

export default SpeciesContext;
