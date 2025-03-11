import AnimalCard from "@/entities/animal/ui/animalCard";
import { cn } from "@/lib/utils";
import { AnimalType } from "@/entities/animal/model/type/animal";
import { useTranslations } from "next-intl";
import useLikedAnimalsStore from "@/zustand/store/likedAnimals.store";
import LikeAnimalButton from "@/features/animal/likeAnimal/ui/likeAnimalButton";

type Props = { className?: string; closeModal: (value: boolean) => void };

const Index = ({ className, closeModal }: Props) => {
	const t = useTranslations();
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);

	return (
		<div className={cn(className)}>
			<div className="flex justify-center">
				{likedAnimals && likedAnimals.size ? (
					<div className="flex w-full flex-col">
						<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
							{Array.from(likedAnimals).map(([id, animal]: [string, AnimalType]) => {
								return (
									<AnimalCard
										onHandleCardClick={() => closeModal(false)}
										isEditable={false}
										key={id}
										animal={animal}
										JSXLikeButton={LikeAnimalButton}
									/>
								);
							})}
						</div>
					</div>
				) : (
					<span>{t("noAnimals")}</span>
				)}
			</div>
		</div>
	);
};

export default Index;
