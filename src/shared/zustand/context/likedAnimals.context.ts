import { createContext } from "react";
import LikedAnimalsSlice from "@/shared/zustand/slice/likedAnimals.slice";

const LikedAnimalsContext = createContext<ReturnType<typeof LikedAnimalsSlice> | null>(null);

export default LikedAnimalsContext;
