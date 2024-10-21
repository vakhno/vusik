import { AnimalType } from "@/types/animal.type";
import AnimalCard from "@/entities/animalCard";
import useLikedAnimalsStore from "@/zustand/store/likedAnimals.store";
import { ShelterType } from "@/types/shelter.type";
import { queryProfileMutation } from "@/queries/profile.query";
import { Types } from "mongoose";

type Props = { isEditable: boolean; animals: AnimalType[]; shelters: ShelterType[]; userId: Types.ObjectId };

const Index = ({ isEditable, animals, shelters, userId }: Props) => {
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);
	const handleAnimalLike = useLikedAnimalsStore((state) => state.handleAnimalLike);
	const handleAnimalUnlike = useLikedAnimalsStore((state) => state.handleAnimalUnlike);
	const profileMutation = queryProfileMutation({ userId });

	const animalLike = (likedAnimalId: string) => {
		handleAnimalLike(likedAnimalId);
	};

	const animalUnlike = (unlikedAnimalId: string) => {
		handleAnimalUnlike(unlikedAnimalId);
	};

	const handleDelete = () => {
		profileMutation.mutate(userId);
	};

	return (
		<>
			{animals && animals.length ? (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-420 gap-4">
					{animals.map((animal) => {
						return (
							<AnimalCard
								isEditable={isEditable}
								userId={userId}
								key={animal._id.toString()}
								handleDelete={() => handleDelete()}
								handleLike={(updateLikedAnimals) => animalLike(updateLikedAnimals)}
								handleUnlike={(updateLikedAnimals) => animalUnlike(updateLikedAnimals)}
								animal={animal}
								shelters={shelters}
								likedAnimals={likedAnimals}
							/>
						);
					})}
				</div>
			) : (
				<span className="m-auto">no animals yet</span>
			)}
		</>
	);
};

export default Index;
