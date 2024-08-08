// UI components
import { Separator } from "@/components/ui/separator";
// libs
import { cn } from "@/lib/utils";

interface Props {
	text: string;
	className?: string;
}

const TextBetweenSeparators = ({ text = "", className = "" }: Props) => {
	return (
		<div className={cn("flex items-center justify-center overflow-hidden", className)}>
			<Separator />
			<span className="px-4">{text}</span>
			<Separator />
		</div>
	);
};

export default TextBetweenSeparators;
