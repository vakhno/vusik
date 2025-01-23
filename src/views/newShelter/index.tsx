"use client";
import NewShelterForm from "@/features/shelter/newShelter/ui/newShelterForm";
import { NewShelterSchemaType } from "@/entities/shelter/model/type/newShelterForm";
import { useToast } from "@/shared/ui/use-toast";
import { API_NEW_SHELTER } from "@/routes";

const buildFormDataForNewShelter = (fields: NewShelterSchemaType): FormData => {
	const {
		mainPhoto,
		secondaryPhotos,
		name,
		country,
		state,
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
	formData.append("state", state);
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

const Index = () => {
	const { toast } = useToast();

	const handleSuccessSubmitClick = async (fields: NewShelterSchemaType) => {
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
			<NewShelterForm handleSuccessSubmitClick={handleSuccessSubmitClick} />
		</>
	);
};

export default Index;
