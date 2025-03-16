import { useContext } from "react";
import LikedAnimalsContext from "@/shared/zustand/context/likedAnimals.context";
import { useStore } from "zustand";
import { LikedAnimalsState } from "@/shared/zustand/slice/likedAnimals.slice";

const LikedAnimalsStore = <T>(selector: (state: LikedAnimalsState) => T): T => {
	const store = useContext(LikedAnimalsContext);
	if (!store) {
		throw new Error("LikedAnimalsStore must be used within a LikedAnimalsProvider");
	}
	return useStore(store, selector);
};

export default LikedAnimalsStore;
