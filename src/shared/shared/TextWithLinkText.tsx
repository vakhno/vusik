// libs
import { cn } from "@/shared/lib/utils";
// next tools
import Link from "next/link";

interface Props {
	text: string;
	linkText: string;
	href: string;
	className?: string;
}

const TextWithLinkText = ({ text = "", linkText = "", href = "/", className = "" }: Props) => {
	return (
		<div className={cn("flex justify-center", className)}>
			<span>{text}</span>
			&nbsp;
			<Link href={href} className="font-bold" prefetch={true}>
				{linkText}
			</Link>
		</div>
	);
};

export default TextWithLinkText;
