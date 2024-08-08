import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserType } from "@/types/user.type";
import { persist } from "zustand/middleware";

export interface UserState {
	user: UserType | null;
	setUser: (user: UserType | null) => void;
	logout: () => void;
}

const useUserStore = create<UserState>()(
	devtools(
		persist(
			(set) => ({
				user: null,
				setUser: (user: UserType | null) => set({ user }),
				logout: () => set({ user: null }),
			}),
			{ name: "useUserStore" },
		),
	),
);
export default useUserStore;
