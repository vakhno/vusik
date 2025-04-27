"use client";

// shared
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import useLikedAnimalsStore from "@/shared/zustand/store/likedAnimals.store";
// sonner
import { toast } from "sonner";
// entities
import { AnimalType, PopulatedAnimalType } from "@/entities/animal/model/type/animal";
// next-intl
import { useTranslations } from "next-intl";
// lucide-react
import { Heart, HeartCrack } from "lucide-react";

type Props = {
	className?: string;
	animal: AnimalType | PopulatedAnimalType;
};

const Index = ({ className = "", animal }: Props) => {
	const t = useTranslations();
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);
	const handleAnimalLike = useLikedAnimalsStore((state) => state.handleAnimalLike);

	const onHandleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const isAlreadyLiked = likedAnimals.has(String(animal._id));

		handleAnimalLike(animal);

		toast(isAlreadyLiked ? t("like.toast.removed-title") : t("like.toast.added-title"), {
			description: isAlreadyLiked ? t("like.toast.removed-description") : t("like.toast.added-description"),
		});
	};

	return (
		<Button className={cn("h-14 w-14 flex-shrink-0 rounded-full p-3", className)} variant="secondary" onClick={onHandleClick} aria-label="">
			{likedAnimals.has(String(animal._id)) ? <Heart className="min-h-full min-w-full" fill="red" stroke="red" /> : <HeartCrack className="min-h-full min-w-full" />}
		</Button>
	);
};

export default Index;
