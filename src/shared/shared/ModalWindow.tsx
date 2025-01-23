// react
import { ReactNode } from "react";
// ui components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

type Props = {
	children?: ReactNode;
	modalTitle?: string;
	setIsOpen: (value: boolean) => void;
	isOpen: boolean;
};

function ModalWindow({ children, modalTitle, setIsOpen, isOpen }: Props) {
	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen} modal>
			<DialogContent className="h-full max-w-[720px]">
				{modalTitle ? (
					<DialogHeader>
						<DialogTitle>{modalTitle}</DialogTitle>
					</DialogHeader>
				) : null}
				{children}
			</DialogContent>
		</Dialog>
	);
}

export default ModalWindow;
