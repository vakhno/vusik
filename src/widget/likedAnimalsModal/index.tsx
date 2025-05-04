// react
import { useState } from "react";
// zustand
import useLikedAnimalsStore from "@/shared/zustand/store/likedAnimals.store";
// UI components
import { Button } from "@/shared/ui/button";
// shared
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
// features
import LikedAnimalList from "@/features/likedAnimalList";
// utils
import { cn } from "@/shared/lib/utils";
import { useTranslations } from "next-intl";
// lucide-react
import { Heart, HeartCrack } from "lucide-react";

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

			<Button className={cn(className, "relative h-full w-full p-0")} variant="link" onClick={onHandleClick}>
				{likedAnimals.size > 0 ? (
					<>
						<Heart fill="red" stroke="red" className="min-h-8 min-w-8" />
						<span className="text-xs">{likedAnimals.size}</span>
					</>
				) : (
					<HeartCrack className="min-h-8 min-w-8" />
				)}
			</Button>
		</>
	);
};

export default Index;
