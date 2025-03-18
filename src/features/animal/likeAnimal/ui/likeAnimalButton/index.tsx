// shared
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
// next tools
import Image from "next/image";
// zustand
import useLikedAnimalsStore from "@/shared/zustand/store/likedAnimals.store";
// entities
import { AnimalType } from "@/entities/animal/@x/shelter";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	animal: AnimalType;
};

const index = ({ animal }: Props) => {
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
		<Button className="p-0" variant="link" onClick={onHandleClick}>
			<Image
				src={`${likedAnimals.size && likedAnimals.has(String(animal._id)) ? "/icons/love-active.svg" : "/icons/love-non-active.svg"}`}
				width={40}
				height={40}
				alt={`${likedAnimals.size && likedAnimals.has(String(animal._id)) ? "Unlike animal" : "Like animal"}`}
			/>
		</Button>
	);
};

export default index;
