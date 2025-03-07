"use client";
import { useRef, ReactNode } from "react";
import UserSlice from "@/zustand/slice/user.slice";
import { UserType } from "@/entities/profile/model/type/profile";
import UserContext from "@/zustand/context/user.context";

type Props = {
	preloadUser: UserType | null;
	children: ReactNode;
};

const UserProvider = ({ preloadUser, children }: Props) => {
	const storeRef = useRef(UserSlice(preloadUser));
	return <UserContext.Provider value={storeRef.current}>{children}</UserContext.Provider>;
};

export default UserProvider;
