import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShelterType } from "@/types/shelter.type";
import AddNewShelterModal from "@/entities/shelterCardModal";
import { Types } from "mongoose";
import ShelterCard from "@/entities/shelterCard";
import { NewShelterSchemaType } from "@/schemas/shelter/shelter.schema";
import { useToast } from "@/components/ui/use-toast";
import { API_NEW_SHELTER } from "@/routes";

type Props = {
	userId: Types.ObjectId;
	isEditable?: boolean;
	shelters: ShelterType[];
};

const buildFormDataForNewShelter = (fields: NewShelterSchemaType): FormData => {
	const {
		mainPhoto,
		secondaryPhotos,
		name,
		country,
		city,
		street,
		phone,
		postalCode,
		coordinates,
		workingDays,
		specificWeekends,
	} = fields;

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

	if (specificWeekends && specificWeekends.length) {
		specificWeekends.forEach((specificWeekend) => {
			formData.append("specificWeekends[]", JSON.stringify(specificWeekend));
		});
	}

	return formData;
};

const createNewShelter = async (formData: FormData): Promise<boolean> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_NEW_SHELTER}`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};

const Index = ({ userId, isEditable = false, shelters }: Props) => {
	const { toast } = useToast();
	const [isCreateNewShelterActive, setIsCreateNewShelterActive] = useState<boolean>(false);
	const addNewShelter = () => {
		setIsCreateNewShelterActive(true);
	};

	const handleSuccessSubmitClick = async (fields) => {
		const preparedFormData = buildFormDataForNewShelter(fields);

		const result = await createNewShelter(preparedFormData);
		if (result) {
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
	};

	return (
		<>
			{isCreateNewShelterActive ? (
				<AddNewShelterModal
					userId={userId}
					isOpen={isCreateNewShelterActive}
					setIsOpen={setIsCreateNewShelterActive}
					handleSuccessSubmitClick={(fields) => handleSuccessSubmitClick(fields)}
				/>
			) : null}
			{isEditable ? (
				<Button onClick={addNewShelter} className="my-8 w-full">
					Add new shelter
				</Button>
			) : null}
			<div className="m-auto grid h-full w-full grid-cols-1 justify-center gap-4">
				{shelters && shelters.length ? (
					shelters.map((shelter) => {
						return (
							<ShelterCard key={shelter._id} userId={userId} shelter={shelter} isEditable={isEditable} />
						);
					})
				) : (
					<span className="m-auto">no shelters yet</span>
				)}
			</div>
		</>
	);
};

export default Index;
