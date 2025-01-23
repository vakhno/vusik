// react
import { useState } from "react";
// zustand
import useLikedAnimalsStore from "@/zustand/store/likedAnimals.store";
// UI components
import { Button } from "@/shared/ui/button";
// next tools
import Image from "next/image";
// shared
import ModalWindow from "@/shared/shared/ModalWindow";
// features
import LikedAnimalList from "@/features/likedAnimalList";
// utils
import { cn } from "@/lib/utils";

type Props = { className?: string };

const Index = ({ className }: Props) => {
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);
	const [isEditAnimalOpened, setIsEditAnimalOpened] = useState(false);

	return (
		<>
			<ModalWindow isOpen={isEditAnimalOpened} setIsOpen={setIsEditAnimalOpened}>
				<LikedAnimalList closeModal={setIsEditAnimalOpened} />
			</ModalWindow>
			<Button
				className={cn(className, "relative p-0")}
				variant="link"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setIsEditAnimalOpened((prev) => !prev);
				}}
			>
				<span className="absolute right-0 top-0 rounded-full bg-orange-200 px-2 text-xs">
					{likedAnimals.size}
				</span>
				<Image src="/icons/love-active.svg" width={40} height={40} alt="List of liked animals" />
			</Button>
		</>
	);
};

export default Index;
