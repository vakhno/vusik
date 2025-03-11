// react
import { useState } from "react";
// zustand
import useLikedAnimalsStore from "@/zustand/store/likedAnimals.store";
// UI components
import { Button } from "@/shared/ui/button";
// next tools
import Image from "next/image";
// shared
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
// features
import LikedAnimalList from "@/features/likedAnimalList";
// utils
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = { className?: string };

const Index = ({ className }: Props) => {
	const t = useTranslations();
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);
	const [isOpen, setIsOpen] = useState(false);

	const onHandleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<Dialog onOpenChange={setIsOpen} open={isOpen} defaultOpen={isOpen} modal>
				<DialogContent className="max-w-[720px]">
					<DialogHeader>
						<DialogTitle>{t("like.modal.title")}</DialogTitle>
					</DialogHeader>
					<div className="flex h-full items-center space-x-2 overflow-auto">
						<LikedAnimalList closeModal={setIsOpen} />
					</div>
				</DialogContent>
			</Dialog>

			<Button className={cn(className, "relative p-0")} variant="link" onClick={onHandleClick}>
				<span className="absolute right-0 top-0 rounded-full bg-orange-200 px-2 text-xs">
					{likedAnimals.size}
				</span>
				<Image src="/icons/love-active.svg" width={40} height={40} alt="List of liked animals" />
			</Button>
		</>
	);
};

export default Index;
