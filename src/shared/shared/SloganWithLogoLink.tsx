// next-intl
import { useTranslations } from "next-intl";
// shared
import { cn } from "@/shared/lib/utils";
import LogoLink from "@/shared/shared/LogoLink";

type Props = {
	href: string;
	width: number;
	className?: string;
};

const SloganWithLogoLink = ({ href, width, className = "" }: Props) => {
	const t = useTranslations();

	return (
		<div className={cn("flex flex-col items-center justify-center", className)}>
			<LogoLink width={width} href={href} className="mb-1" />
			<span>{t("logo-with-slogan-link.description")}</span>
		</div>
	);
};

export default SloganWithLogoLink;
