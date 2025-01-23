"use client";
import NewShelterForm from "@/features/shelter/newShelter/ui/newShelterForm";
// import { API_NEW_ANIMAL } from "@/routes";
import { Types } from "mongoose";
import { queryShelter } from "@/entities/shelter/model/query/shelterById";
// import { AnimalType } from "@/entities/animal/model/type";
import { useToast } from "@/shared/ui/use-toast";
import { NewShelterSchemaType } from "@/entities/shelter/model/type/newShelterForm";

// const ACTIVE_DOMEN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN;

type Props = {
	shelterId: Types.ObjectId;
};

const buildFormDataForEditShelter = (fields: NewShelterSchemaType, id: Types.ObjectId): FormData => {
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

	formData.append("id", String(id));
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

const Index = ({ shelterId }: Props) => {
	const { toast } = useToast();

	const { data: shelter } = queryShelter({ shelterId: shelterId });
	if (shelter) {
		// const user = useUserStore((state) => state.user);
		// console.log("DATA", data);
		// const profileMutation = queryProfileMutation({ animalId });

		const handleSuccessSubmitClick = async (fields: NewShelterSchemaType) => {
			const formData = buildFormDataForEditShelter(fields, shelterId);

			// const response = await fetch(`${ACTIVE_DOMEN}${API_NEW_ANIMAL}`, {
			// 	method: "POST",
			// 	body: formData,
			// });
			// const data = (await response.json()) as { success: false } | { success: true; animal: AnimalType };
			// const { success } = data;

			// if (success) {
			// 	profileMutation.mutate(userId);
			// }

			const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/put-edit-shelter`, {
				method: "PUT",
				body: formData,
			});

			const { ok } = response;

			if (ok) {
				const data = await response.json();
				const { success } = data;
				if (success) {
					// profileMutation.mutate(userId);
					// setIsEditAnimalOpened(false);
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

		return <NewShelterForm handleSuccessSubmitClick={handleSuccessSubmitClick} shelter={shelter} />;
	}

	return null;
};

export default Index;
