"use client";

// next tools
import Image from "next/image";
// shared
import { Button, buttonVariants } from "@/shared/ui/button";
// libs
import { cn } from "@/lib/utils";
// next-intl
import { useTranslations } from "next-intl";
// routes
import { GOOGLE_AUTH_ROUTE } from "@/routes";

interface Props {
	className?: string;
}

const GoogleAuth = ({ className = "" }: Props) => {
	const t = useTranslations();

	const handleClick = async () => {
		window.location.href = `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${GOOGLE_AUTH_ROUTE}`;
	};

	return (
		<Button
			className={cn(buttonVariants({ variant: "default" }), "flex w-full justify-center gap-2", className)}
			onClick={handleClick}
		>
			<Image
				width={26}
				height={26}
				src="/icons/auth/auth-google-logo.webp"
				alt={t("auth.google-logo-alt")}
				className="brightness-0 invert dark:invert-0"
			/>
			<span>{t("auth.google")}</span>
		</Button>
	);
};

export default GoogleAuth;
