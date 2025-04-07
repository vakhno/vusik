"use client";

// next tools
import Image from "next/image";
// shared
import { Button, buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { GOOGLE_AUTH_ROUTE } from "@/shared/constants/routes";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { GOOGLE_LOGO } from "@/shared/constants/public";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	className?: string;
};

const GoogleAuth = ({ className = "" }: Props) => {
	const t = useTranslations();

	const handleClick = async () => {
		window.location.href = `${NEXT_PUBLIC_ACTIVE_DOMEN}${GOOGLE_AUTH_ROUTE}`;
	};

	return (
		<Button className={cn(buttonVariants({ variant: "default" }), "flex w-full justify-center gap-2", className)} onClick={handleClick}>
			<Image width={26} height={26} src={GOOGLE_LOGO} alt={t("auth.google-logo-alt")} className="brightness-0 invert dark:invert-0" />
			<span>{t("auth.google")}</span>
		</Button>
	);
};

export default GoogleAuth;
