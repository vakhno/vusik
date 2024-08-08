"use client";
import { useRef, ReactNode } from "react";
import UserSlice from "@/zustand/user/slice/user.slice";
import { UserType } from "@/types/user.type";
import UserContext from "@/zustand/user/context/user.context";

type Props = {
	preloadUser: UserType | null;
	children: ReactNode;
};

const UserProvider = ({ preloadUser, children }: Props) => {
	const storeRef = useRef(UserSlice(preloadUser));
	return <UserContext.Provider value={storeRef.current}>{children}</UserContext.Provider>;
};

export default UserProvider;
