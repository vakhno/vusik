"use client";
// UI components
import { buttonVariants } from "@/components/ui/button";
// next tools
import Link from "next/link";
// libs
import { cn } from "@/lib/utils";
// next-intl
import { useTranslations } from "next-intl";

const NonAuthUser = () => {
	const t = useTranslations();

	return (
		<Link href="/auth/sign-in" className={cn(buttonVariants({ variant: "secondary" }))} prefetch={true}>
			{t("auth.sign-in-label")}
		</Link>
	);
};

export default NonAuthUser;
