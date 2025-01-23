"use client";
// zustand
import useUserStore from "@/zustand/store/user.store";
// actions
import logout from "@/actions/auth/logout";
// UI components
import { Button } from "@/shared/ui/button";
// next-intl
import { useTranslations } from "next-intl";

const index = () => {
	const t = useTranslations();
	const setUser = useUserStore((state) => state.setUser);

	const handleLogOut = () => {
		logout();
		setUser(null);
	};

	return (
		<Button variant="destructive" onClick={handleLogOut}>
			{t("auth.logout-label")}
		</Button>
	);
};

export default index;
