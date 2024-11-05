import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, MouseEvent } from "react";
import AddNewShelterModal from "@/entities/shelterCardModal";
import { Types } from "mongoose";
import { ShelterType } from "@/types/shelter.type";
import { NewShelterSchemaType } from "@/schemas/shelter/shelter.schema";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

type Props = {
	userId: Types.ObjectId;
	shelter: ShelterType;
	isEditable?: boolean;
};

const buildFormDataForNewShelter = (fields: NewShelterSchemaType): FormData => {
	const { mainPhoto, secondaryPhotos, name, country, city, street, phone, postalCode, coordinates, workingDays } =
		fields;

	const formData = new FormData();

	formData.append("name", name);
	formData.append("country", country);
	formData.append("city", city);
	formData.append("street", street);
	formData.append("phone", phone);
	formData.append("postalCode", postalCode);
	formData.append("coordinates", JSON.stringify(coordinates));
	formData.append("workingDays", JSON.stringify(workingDays));

	if (mainPhoto) {
		formData.append("mainPhoto", mainPhoto);
	}

	if (secondaryPhotos && secondaryPhotos.length) {
		secondaryPhotos.forEach((secondaryPhoto) => {
			formData.append("secondaryPhotos[]", secondaryPhoto);
		});
	}

	return formData;
};

const Index = ({ userId, shelter, isEditable = false }: Props) => {
	const { toast } = useToast();
	const [isEditShelterOpened, setIsEditShelterOpened] = useState<boolean>(false);

	const handleEditClick = (e: MouseEvent<HTMLImageElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsEditShelterOpened(!isEditShelterOpened);
	};

	const handleSuccessDeleteClick = async (shelter: ShelterType) => {
		const formData = new FormData();

		formData.append("shelterId", shelter._id);
		formData.append("userId", String(shelter.userId));

		shelter.activeMembers.forEach((activeMember) => formData.append("activeMembers[]", activeMember));
		shelter.adoptedMembers.forEach((adoptedMember) => formData.append("adoptedMembers[]", adoptedMember));
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/delete-shelter`, {
			method: "DELETE",
			body: formData,
		});
		const { ok } = response;
		if (ok) {
			// const data = await response.json();
			// const { success } = data;
		}
	};

	const handleSuccessSubmitClick = async (fields: NewShelterSchemaType) => {
		const formData = buildFormDataForNewShelter(fields);
		formData.append("id", shelter._id);
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/put-edit-shelter`, {
			method: "PUT",
			body: formData,
		});

		const { ok } = response;
		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				toast({
					title: "Success",
					description: `New shelter is created!`,
					variant: "default",
				});
			} else {
				toast({
					title: "Error",
					description: `Something went wrong while creating a new shelter!`,
					variant: "destructive",
				});
			}
		}
	};

	return (
		<>
			{isEditShelterOpened ? (
				<AddNewShelterModal
					userId={userId}
					isOpen={isEditShelterOpened}
					setIsOpen={setIsEditShelterOpened}
					isDeletable={true}
					deleteButtonTitle={"Delete"}
					handleSuccessDeleteClick={handleSuccessDeleteClick}
					handleSuccessSubmitClick={(fields) => handleSuccessSubmitClick(fields)}
					shelter={shelter}
					mainPhotoValue={shelter.mainPhoto}
					secondaryPhotosValue={shelter.secondaryPhotos}
					nameValue={shelter.name}
					countryValue={shelter.country}
					cityValue={shelter.city}
					streetValue={shelter.street}
					coordinatesValue={shelter.coordinates}
					postalCodeValue={shelter.postalCode}
					phoneValue={shelter.phone}
					workingDaysValue={shelter.workingDays}
					specificWeekendValue={shelter.specificWeekends}
				/>
			) : null}
			<Card key={shelter._id} className="w-full bg-secondary">
				<Link href={`/shelter/${shelter._id}`}>
					<CardContent className="relative h-full w-full overflow-hidden p-2">
						{isEditable ? (
							<Image
								width={40}
								height={40}
								alt=""
								src="/icons/edit.svg"
								onClick={(e: MouseEvent<HTMLImageElement>) => handleEditClick(e)}
								className="absolute right-0 top-0 z-10 cursor-pointer"
							/>
						) : null}
						<div className="grid grid-cols-1 lg:grid-cols-2">
							<AspectRatio ratio={5 / 3} className="relative h-full w-full">
								<Image
									src={shelter.mainPhoto}
									alt="Shelter photo"
									fill
									className="h-full w-full object-cover"
								/>
							</AspectRatio>
							<div className="flex flex-col justify-between p-4">
								<div className="flex flex-col">
									<h2>{shelter.name}</h2>
									<span>
										{shelter.country}, {shelter.city}, {shelter.street}
									</span>
									<a href={`tel: ${shelter.phone}`}>{shelter.phone}</a>
								</div>
								<Button>More</Button>
							</div>
						</div>
					</CardContent>
				</Link>
			</Card>
		</>
	);
};

export default Index;
