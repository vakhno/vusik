// widgets
import AnimalListSkeleton from "@/widget/animal/animalList/ui/animalListSkeleton";
// entities
import { AnimalType } from "@/entities/animal/model/type/animal";
import AnimalCard from "@/entities/animal/ui/animalCard";
// features
import AnimalLikeButton from "@/features/animal/likeAnimal/ui/likeAnimalButton";

type Props = {
	isLoading: boolean;
	animals: AnimalType[];
	isEditable: boolean;
	isFetching: boolean;
};

const index = ({ isLoading, animals, isEditable, isFetching }: Props) => {
	return (
		<>
			{!isLoading ? (
				<div className="flex justify-center">
					{animals && animals.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-320-1fr gap-4">
								{animals.map((animal: AnimalType) => {
									return (
										<AnimalCard
											isEditable={isEditable}
											key={animal._id.toString()}
											animal={animal}
											JSXLikeButton={AnimalLikeButton}
										/>
									);
								})}
								{isFetching ? (
									<>
										<AnimalListSkeleton countOfSkeletons={10} />
									</>
								) : null}
							</div>
						</div>
					) : (
						<span>no animals yet</span>
					)}
				</div>
			) : (
				<AnimalListSkeleton countOfSkeletons={10} />
			)}
		</>
	);
};

export default index;
