// UI components
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastProps } from "@/components/ui/toast";
import { VariantProps } from "class-variance-authority";

type Props = {
	text: string;
	copyText: string;
	buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
	ariaLabel?: string;
	isToastShow?: boolean;
	toastTitle?: string;
	toastDescription?: string;
	toastVariant?: ToastProps["variant"];
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
	toastVariant = "default",
}: Props) => {
	const { toast } = useToast();

	const coppiedToClipboard = () => {
		navigator.clipboard.writeText(copyText);
		if (isToastShow) {
			toast({
				title: toastTitle,
				description: toastDescription,
				variant: toastVariant,
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
