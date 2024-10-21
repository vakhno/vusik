"use client";
import { useRef, ReactNode } from "react";
import LikedAnimalsSlice from "@/zustand/slice/likedAnimals.slice";
import LikedAnimalsContext from "@/zustand/context/likedAnimals.context";

type Props = {
	children: ReactNode;
};

const LikedAnimalsProvider = ({ children }: Props) => {
	const storeRef = useRef(LikedAnimalsSlice());
	return <LikedAnimalsContext.Provider value={storeRef.current}>{children}</LikedAnimalsContext.Provider>;
};

export default LikedAnimalsProvider;
