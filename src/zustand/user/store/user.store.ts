import { useContext } from "react";
import UserContext from "@/zustand/user/context/user.context";
import { useStore } from "zustand";
import { UserState } from "@/zustand/user/slice/user.slice";

const UserStore = <T>(selector: (state: UserState) => T): T => {
	const store = useContext(UserContext);
	if (!store) {
		throw new Error("UserStore must be used within a UserProvider");
	}
	return useStore(store, selector);
};

export default UserStore;
