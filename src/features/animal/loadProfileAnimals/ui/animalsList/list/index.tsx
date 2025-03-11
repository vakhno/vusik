"use client";

// shared
import AnimalCardSkeleton from "@/shared/skeleton/animalCardSkeleton";
import { Button } from "@/shared/ui/button";
// entities
import AnimalCard from "@/entities/animal/ui/animalCard";
import { AnimalType } from "@/entities/animal/model/type/animal";
// next-intl
import { useTranslations } from "next-intl";
// features
import LikeAnimalButton from "@/features/animal/likeAnimal/ui/likeAnimalButton";

type Props = {
	isEditable: boolean;
	isLoading: boolean;
	isPending: boolean;
	isFetchingNextPage: boolean;
	isHasNextPage: boolean;
	animals: AnimalType[];
	countPerPage: number;
	onNewPageUpload: () => void;
};

const Index = ({
	isEditable,
	isLoading,
	isPending,
	isFetchingNextPage,
	isHasNextPage,
	animals,
	countPerPage,
	onNewPageUpload,
}: Props) => {
	const t = useTranslations();
	const handleNewPageUpload = () => {
		onNewPageUpload();
	};

	return (
		<div>
			{!isLoading ? (
				<div className="flex justify-center">
					{animals && animals.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
								{animals.map((animal: AnimalType) => {
									return (
										<AnimalCard
											isEditable={isEditable}
											key={animal._id.toString()}
											animal={animal}
											JSXLikeButton={LikeAnimalButton}
										/>
									);
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: countPerPage }, (_, index) => (
											<AnimalCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{isHasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => handleNewPageUpload()}>{t("page.animals.load-more")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("page.animals.no-animals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
					{Array.from({ length: countPerPage }, (_, index) => (
						<AnimalCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
