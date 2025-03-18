import { createStore } from "zustand";
import { devtools } from "zustand/middleware";
import { UserType } from "@/entities/profile/model/type/profile";

export interface UserState {
	user: UserType | null;
	setUser: (user: UserType | null) => void;
	logout: () => void;
}

const UserSlice = (initialState: UserType | null = null) =>
	createStore<UserState>()(
		devtools(
			(set) => ({
				user: initialState,
				setUser: (user: UserType | null) => set({ user }),
				logout: () => set({ user: null }),
			}),
			{ name: "UserSlice" },
		),
	);

export default UserSlice;
