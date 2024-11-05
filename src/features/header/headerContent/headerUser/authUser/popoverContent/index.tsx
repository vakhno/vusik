"use client";
// actions
import logout from "@/actions/auth/logout";
// UI components
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user.type";
// zustand
import useUserStore from "@/zustand/store/user.store";
// next-intl
import { useTranslations } from "next-intl";
import Link from "next/link";

const PopoverContent = () => {
	const t = useTranslations();
	const setUser = useUserStore((state) => state.setUser);
	const user = useUserStore((state) => state.user) as UserType;
	const { _id } = user;

	const handleLogOut = () => {
		logout();
		setUser(null);
	};

	return (
		<div className="flex flex-col">
			<Link href={`/profile/${_id}`}>Profile</Link>
			<Button variant="destructive" onClick={handleLogOut}>
				{t("auth.logout-label")}
			</Button>
		</div>
	);
};

export default PopoverContent;
