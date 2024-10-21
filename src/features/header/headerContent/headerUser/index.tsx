"use client";
// components
import AuthUser from "./authUser";
import NonAuthUser from "./nonAuthUser/index";
// zustand
import useUserStore from "@/zustand/store/user.store";

const HeaderUser = () => {
	const user = useUserStore((state) => state.user);

	if (user) {
		const { avatar } = user;

		return <AuthUser avatar={avatar} />;
	}

	return <NonAuthUser />;
};

export default HeaderUser;
