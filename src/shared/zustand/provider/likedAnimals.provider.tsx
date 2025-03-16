"use client";
import { useRef, ReactNode } from "react";
import LikedAnimalsSlice from "@/shared/zustand/slice/likedAnimals.slice";
import LikedAnimalsContext from "@/shared/zustand/context/likedAnimals.context";

type Props = {
	children: ReactNode;
};

const LikedAnimalsProvider = ({ children }: Props) => {
	const storeRef = useRef(LikedAnimalsSlice());
	return <LikedAnimalsContext.Provider value={storeRef.current}>{children}</LikedAnimalsContext.Provider>;
};

export default LikedAnimalsProvider;
