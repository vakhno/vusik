"use client";
import NewAnimalForm from "@/features/animal/editAnimal/ui/editAnimalForm/formFields";
// import { API_NEW_ANIMAL } from "@/routes";
import { Types } from "mongoose";
import { queryAnimal } from "@/entities/animal/model/query/animalById";
import { species } from "@/constants/species";
// import { AnimalType } from "@/entities/animal/model/type";
import { useToast } from "@/shared/ui/use-toast";
import NewAnimalSchemaType from "@/entities/animal/model/type/newAnimalForm";
// const ACTIVE_DOMEN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN;

type Props = {
	animalId: Types.ObjectId;
};

const Index = ({ animalId }: Props) => {
	const { toast } = useToast();

	const { data } = queryAnimal({ animalId: animalId });
	if (data) {
		const { animal, user } = data;
		// const user = useUserStore((state) => state.user);
		// console.log("DATA", data);
		// const profileMutation = queryProfileMutation({ animalId });

		const handleSuccessSubmitClick = async (fields: NewAnimalSchemaType) => {
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
			} = fields;
			const formData = new FormData();

			formData.append("id", String(animalId));
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

			// const response = await fetch(`${ACTIVE_DOMEN}${API_NEW_ANIMAL}`, {
			// 	method: "POST",
			// 	body: formData,
			// });
			// const data = (await response.json()) as { success: false } | { success: true; animal: AnimalType };
			// const { success } = data;

			// if (success) {
			// 	profileMutation.mutate(userId);
			// }

			const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/put-edit-animal`, {
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

		if (user) {
			return (
				<NewAnimalForm
					handleSuccessSubmitClick={handleSuccessSubmitClick}
					species={species}
					shelters={user.shelters}
					animal={animal}
				/>
			);
		}

		return null;
	}

	return null;
};

export default Index;
