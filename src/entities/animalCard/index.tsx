import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { AnimalType } from "@/types/animal.type";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AnimalCardModal from "@/entities/animalCardModal";
import { ShelterType } from "@/types/shelter.type";
import { Types } from "mongoose";
import { NewAnimalSchemaType } from "@/schemas/animal/animal.schema";
import useLikedAnimalsStore from "@/zustand/store/likedAnimals.store";
import { species } from "@/constants/species";
import { queryProfileMutation } from "@/queries/profile.query";
import Link from "next/link";

type Props =
	| {
			isEditable: true;
			userId: Types.ObjectId;
			animal: AnimalType;
			shelters: ShelterType[];
			handleDelete?: () => void;
			handleLike: (id: string) => void;
			handleUnlike: (id: string) => void;
	  }
	| {
			isEditable: false;
			userId?: Types.ObjectId;
			animal: AnimalType;
			shelters?: ShelterType[];
			handleDelete?: () => void;
			handleLike: (id: string) => void;
			handleUnlike: (id: string) => void;
	  };

const Index = ({ isEditable, userId, animal, shelters, handleDelete, handleLike, handleUnlike }: Props) => {
	const likedAnimals = useLikedAnimalsStore((state) => state.likedAnimals);
	const handleAnimalLike = useLikedAnimalsStore((state) => state.handleAnimalLike);
	const handleAnimalUnlike = useLikedAnimalsStore((state) => state.handleAnimalUnlike);
	const { toast } = useToast();
	const [isEditAnimalOpened, setIsEditAnimalOpened] = useState<boolean>(false);

	const animalUnlike = (id: string, name: string) => {
		handleAnimalUnlike(id);

		toast({
			title: "Success",
			description: `You unliked ${name}`,
			variant: "default",
		});

		handleUnlike && handleUnlike(id);
	};

	const animalLike = (id: string, name: string) => {
		handleAnimalLike(id);

		toast({
			title: "Success",
			description: `You liked ${name}`,
			variant: "default",
		});

		handleLike && handleLike(id);
	};

	const handleEditClick = () => {
		setIsEditAnimalOpened(true);
	};

	const handleSuccessSubmitClick = async (data: NewAnimalSchemaType) => {
		const {
			mainPhoto,
			secondaryPhotos,
			name,
			species,
			breed,
			shelterId,
			size,
			sex,
			sterilized,
			injury,
			injuryDescription,
			age,
		} = data;

		const formData = new FormData();

		formData.append("id", animal._id.toString());
		formData.append("name", name);
		formData.append("species", species);
		formData.append("breed", breed);
		formData.append("shelterId", shelterId);
		formData.append("size", size);
		formData.append("sex", sex);
		formData.append("age", String(age));
		formData.append("sterilized", JSON.stringify(sterilized));
		formData.append("injury", JSON.stringify(injury));
		formData.append("injuryDescription", String(injuryDescription));

		if (mainPhoto) {
			formData.append("mainPhoto", mainPhoto);
		}

		if (secondaryPhotos && secondaryPhotos.length) {
			secondaryPhotos.forEach((secondaryPhoto) => {
				formData.append("secondaryPhotos[]", secondaryPhoto);
			});
		}

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/put-edit-animal`, {
			method: "PUT",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				if (userId) {
					queryProfileMutation({ userId }).mutate(userId);
				}
				setIsEditAnimalOpened(false);
				toast({
					title: "Success",
					description: `Edited`,
					variant: "default",
				});
			} else {
				toast({
					title: "Error",
					description: `Something went wrong`,
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Error",
				description: `Something went wrong`,
				variant: "destructive",
			});
		}
	};

	const handleCloseClick = () => {
		setIsEditAnimalOpened(false);
	};

	const handleSuccessDeleteClick = async (animal: AnimalType) => {
		const { _id, shelterId, userId } = animal;
		const formData = new FormData();

		formData.append("animalId", _id.toString());
		formData.append("shelterId", shelterId.toString());
		formData.append("userId", userId.toString());

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/delete-animal`, {
			method: "DELETE",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				toast({
					title: "Success",
					description: `Deletion is confirmed`,
					variant: "default",
				});

				handleDelete && handleDelete();
			} else {
				toast({
					title: "Error",
					description: `Deletion cancelled`,
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Error",
				description: `Something went wrong`,
				variant: "destructive",
			});
		}
	};

	return (
		<>
			{isEditAnimalOpened ? (
				<AnimalCardModal
					modalTitle={"Edit animal"}
					submitButtonTitle={"Save"}
					closeButtonTitle={"Close"}
					deleteButtonTitle={"Delete"}
					isOpen={isEditAnimalOpened}
					setIsOpen={setIsEditAnimalOpened}
					handleSuccessSubmitClick={handleSuccessSubmitClick}
					handleCloseClick={handleCloseClick}
					animal={animal}
					isDeletable={true}
					species={species || []}
					handleSuccessDeleteClick={handleSuccessDeleteClick}
					shelters={shelters}
					//
					mainPhotoValue={animal.mainPhoto}
					secondaryPhotosValue={animal.secondaryPhotos}
					nameValue={animal.name}
					ageValue={animal.age}
					shelterValue={animal.shelterId.toString()}
					sexValue={animal.sex}
					speciesValue={animal.species}
					breedValue={animal.breed}
					sizeValue={animal.size}
					sterilizedValue={animal.sterilized}
					injuryValue={animal.injury}
					injuryDescriptionValue={animal.injuryDescription}
				/>
			) : null}
			<Card className="w-full bg-primary">
				<Link href={`/animal/${animal._id}`}>
					<CardContent className="relative h-full w-full overflow-hidden p-2">
						<AspectRatio ratio={2 / 3} className="relative h-full w-full">
							{animal.mainPhoto ? (
								<Image
									src={animal.mainPhoto}
									alt="Pet photo"
									fill
									className="h-full w-full object-cover"
								/>
							) : null}
							{isEditable ? (
								<Image
									width={40}
									height={40}
									alt=""
									src="/icons/edit.svg"
									onClick={handleEditClick}
									className="absolute right-0 top-0 z-10 cursor-pointer"
								/>
							) : null}
						</AspectRatio>
						<div className="flex w-full items-center justify-between px-4 py-2 text-white">
							<div className="truncate">
								<div className="truncate">{animal.name}</div>
								<div>
									<span>{animal.sex}</span>
									<span>{animal.age}</span>
								</div>
							</div>
							{likedAnimals.includes(animal._id.toString()) ? (
								<Button
									className="p-0"
									variant="link"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										animalUnlike(animal._id.toString(), animal.name);
									}}
								>
									<Image src="/icons/love-active.svg" width={40} height={40} alt="Unlike pet" />
								</Button>
							) : (
								<Button
									className="p-0"
									variant="link"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										animalLike(animal._id.toString(), animal.name);
									}}
								>
									<Image src="/icons/love-non-active.svg" width={40} height={40} alt="Like pet" />
								</Button>
							)}
						</div>
					</CardContent>
				</Link>
			</Card>
		</>
	);
};

export default Index;
