// UI components
import { Button, buttonVariants } from "@/shared/ui/button";
import { toast } from "sonner";
import { VariantProps } from "class-variance-authority";

type Props = {
	text: string;
	copyText: string;
	buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
	ariaLabel?: string;
	isToastShow?: boolean;
	toastTitle?: string;
	toastDescription?: string;
	className?: string;
};

const TextWithClipboardCopy = ({
	className = "",
	copyText = "",
	text = "",
	buttonVariant = "link",
	ariaLabel = "",
	isToastShow = false,
	toastTitle = "",
	toastDescription = "",
}: Props) => {
	const coppiedToClipboard = () => {
		navigator.clipboard.writeText(copyText);
		if (isToastShow) {
			toast(toastTitle, {
				description: toastDescription,
			});
		}
	};

	return (
		<Button className={className} variant={buttonVariant} aria-label={ariaLabel} onClick={coppiedToClipboard}>
			{text}
		</Button>
	);
};

export default TextWithClipboardCopy;
