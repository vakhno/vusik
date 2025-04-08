"use client";

// shared
import useUserStore from "@/shared/zustand/store/user.store";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
// features
import logout from "@/features/auth/logout/model/action/logout";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	className?: string;
};

const Index = ({ className = "" }: Props) => {
	const t = useTranslations();
	const setUser = useUserStore((state) => state.setUser);

	const handleLogOut = async () => {
		logout();
		setUser(null);
	};

	return (
		<Button variant="destructive" onClick={handleLogOut} className={cn(className)}>
			{t("auth.logout-label")}
		</Button>
	);
};

export default Index;
