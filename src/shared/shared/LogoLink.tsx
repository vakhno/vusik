// next tools
import Image from "next/image";
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";

interface Props {
	href: string;
	width: number;
	className?: string;
}

const LogoLink = ({ href = "/", width = 100, className = "" }: Props) => {
	const t = useTranslations();

	return (
		<Link href={href} aria-label={t("logo-link.link-aria-label")} className={className}>
			<Image src="/logo/vusik-logo.svg" alt={t("logo-link.image-alt")} width={width} height={0} />
		</Link>
	);
};

export default LogoLink;
