// components
import LogoLink from "@/components/shared/LogoLink";
// next-intl
import { useTranslations } from "next-intl";
// libs
import { cn } from "@/lib/utils";

type Props = {
	href: string;
	width: number;
	className?: string;
};

const LogoWithSloganLink = ({ href = "/", width = 100, className = "" }: Props) => {
	const t = useTranslations();

	return (
		<div className={cn("flex flex-col items-center", className)}>
			<LogoLink href={href} width={width} className="mb-2" />
			<span>{t("logo-with-slogan-link.description")}</span>
		</div>
	);
};

export default LogoWithSloganLink;
