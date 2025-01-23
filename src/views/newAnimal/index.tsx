"use client";
import NewAnimalForm from "@/features/animal/newAnimal/ui/newAnimalForm";
import { queryProfileMutation } from "@/entities/profile/model/query/profileByProfileId";
import { API_NEW_ANIMAL } from "@/routes";
import { Types } from "mongoose";
import { queryProfile } from "@/entities/profile/model/query/profileByProfileId";
import { species } from "@/constants/species";
import { AnimalType } from "@/entities/animal/model/type";
import NewAnimalSchemaType from "@/entities/animal/model/type/newAnimalForm";
const ACTIVE_DOMEN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN;

type Props = {
	userId: Types.ObjectId;
};

const Index = ({ userId }: Props) => {
	const { data } = queryProfile({ userId: userId });
	const profileMutation = queryProfileMutation({ userId });

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

		const response = await fetch(`${ACTIVE_DOMEN}${API_NEW_ANIMAL}`, {
			method: "POST",
			body: formData,
		});
		const data = (await response.json()) as { success: false } | { success: true; animal: AnimalType };
		const { success } = data;

		if (success) {
			profileMutation.mutate(userId);
		}
	};
	return (
		<NewAnimalForm handleSuccessSubmitClick={handleSuccessSubmitClick} species={species} shelters={data.shelters} />
	);
};

export default Index;
