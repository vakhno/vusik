import { ReactNode } from "react";
// UI components
import { Separator } from "@/shared/ui/separator";
// libs
import { cn } from "@/lib/utils";

interface Props {
	text: string | ReactNode;
	className?: string;
}

const TextBetweenSeparators = ({ text = "", className = "" }: Props) => {
	return (
		<div className={cn("flex items-center justify-center overflow-hidden", className)}>
			<Separator className="flex-1" />
			<span className="px-4 text-center">{text}</span>
			<Separator className="flex-1" />
		</div>
	);
};

export default TextBetweenSeparators;
