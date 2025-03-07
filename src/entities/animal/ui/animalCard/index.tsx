// next-tools
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/shared/ui/card";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { useToast } from "@/shared/ui/use-toast";
import { AnimalType } from "@/entities/animal/model/type/animal";
import { Button } from "@/shared/ui/button";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { Types } from "mongoose";
import useLikedAnimalsStore from "@/zustand/store/likedAnimals.store";

type Props =
	| {
			isEditable: boolean;
			userId: Types.ObjectId;
			animal: AnimalType;
			shelters: ShelterType[];
			handleDelete?: () => void;
			onHandleCardClick?: () => void;
	  }
	| {
			isEditable: boolean;
			userId?: Types.ObjectId;
			animal: AnimalType;
			shelters?: ShelterType[];
			handleDelete?: () => void;
			onHandleCardClick?: () => void;
	  };

const Index = ({ isEditable, animal, onHandleCardClick }: Props) => {
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);
	const handleAnimalLike = useLikedAnimalsStore((state) => state.handleAnimalLike);
	const { toast } = useToast();

	const animalLike = (animal: AnimalType, name: string) => {
		handleAnimalLike(animal);

		toast({
			title: "Success",
			description: `You liked ${name}`,
			variant: "default",
		});
	};

	return (
		<>
			<Card className="w-full overflow-hidden">
				<Link href={`/animal/${animal._id}`} onClick={onHandleCardClick}>
					<CardContent className="relative h-full w-full overflow-hidden p-0">
						<AspectRatio ratio={2 / 3} className="relative h-full w-full">
							{animal.mainPhoto ? (
								<Image
									src={animal.mainPhoto}
									alt="Pet photo"
									fill
									className="h-full w-full object-cover"
								/>
							) : null}
						</AspectRatio>
						<div className="flex flex-col p-2">
							<h3 className="truncate text-2xl font-bold">{animal.name}</h3>
							<div className="flex items-center">
								<span className="text-lg font-medium">{animal.species}</span>
								<span className="mx-2 font-medium">•</span>
								<span className="text-lg font-medium">{animal.breed}</span>
							</div>
							<div className="flex w-full justify-between">
								<div>Size: {animal.size}</div>
								<div>Age: {animal.age}</div>
							</div>
							<div className="flex w-full justify-between">
								<div>Sex: {animal.sex}</div>
								<div>Injured: {`${animal.injury ? "Yes" : "No"}`}</div>
							</div>
						</div>
						<div className="absolute right-1 top-0">
							<Button
								className="p-0"
								variant="link"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									animalLike(animal, animal.name);
								}}
							>
								<Image
									src={`${likedAnimals.size && likedAnimals.has(String(animal._id)) ? "/icons/love-active.svg" : "/icons/love-non-active.svg"}`}
									width={40}
									height={40}
									alt={`${likedAnimals.size && likedAnimals.has(String(animal._id)) ? "Unlike animal" : "Like animal"}`}
								/>
							</Button>
						</div>
						{isEditable ? (
							<div className="absolute left-1 top-0">
								<Link href={`/animal/${animal._id}/edit`} className="p-0">
									<Image width={40} height={40} alt="edit" src="/icons/edit.svg" />
								</Link>
							</div>
						) : null}
					</CardContent>
				</Link>
			</Card>
		</>
	);
};

export default Index;
