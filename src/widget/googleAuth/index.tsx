"use client";
// next tools
import Link from "next/link";
import Image from "next/image";
// UI components
import { buttonVariants } from "@/components/ui/button";
// libs
import { cn } from "@/lib/utils";
// actions
import { getGoogleAuthUrl } from "@/actions/auth/getGoogleAuthUrl";
import { useTranslations } from "next-intl";

interface Props {
	className?: string;
	successRedirection: string;
	errorRedirection: string;
}

const GoogleAuth = ({ className = "", successRedirection = "", errorRedirection = "" }: Props) => {
	const t = useTranslations();

	return (
		<Link
			className={cn(buttonVariants({ variant: "default" }), "flex w-full justify-center gap-2", className)}
			href={getGoogleAuthUrl({
				successRedirection,
				errorRedirection,
			})}
		>
			<Image
				width={26}
				height={26}
				src="/icons/auth/auth-google-logo.webp"
				alt={t("auth.google-logo-alt")}
				className="brightness-0 invert dark:invert-0"
			/>
			<span>{t("auth.google")}</span>
		</Link>
	);
};

export default GoogleAuth;
