// next tools
import Image from "next/image";
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";
// shared
import { MAIN_LOGO } from "@/shared/constants/public";
import { cn } from "@/shared/lib/utils";

type Props = {
	href: string;
	width: number;
	className?: string;
};

const LogoLink = ({ href, width, className = "" }: Props) => {
	const t = useTranslations();

	return (
		<Link href={href} aria-label={t("logo-link.link-aria-label")} className={cn(className)}>
			<Image width={width} height={0} sizes="100vw" className="h-auto" src={MAIN_LOGO} alt={t("logo-link.image-alt")} />
		</Link>
	);
};

export default LogoLink;
