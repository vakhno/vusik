"use client";
// actions
import logout from "@/actions/logout";
// UI components
import { Button } from "@/components/ui/button";
// zustand
import useUserStore from "@/zustand/user/store/user.store";
// next-intl
import { useTranslations } from "next-intl";

const PopoverContent = () => {
	const t = useTranslations();
	const setUser = useUserStore((state) => state.setUser);

	const handleLogOut = () => {
		logout();
		setUser(null);
	};

	return (
		<div className="flex flex-col">
			<div className="flex justify-between">
				<Button variant="destructive" onClick={handleLogOut}>
					{t("auth.logout-label")}
				</Button>
			</div>
		</div>
	);
};

export default PopoverContent;
