import { createContext } from "react";
import LikedAnimalsSlice from "@/zustand/slice/likedAnimals.slice";

const LikedAnimalsContext = createContext<ReturnType<typeof LikedAnimalsSlice> | null>(null);

export default LikedAnimalsContext;
