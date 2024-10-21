import { NewAnimalSchemaType } from "@/schemas/animal/animal.schema";
import { API_NEW_ANIMAL } from "@/routes";
import { AnimalType } from "@/types/animal.type";
// UI components
// form UI components
import { ShelterType } from "@/types/shelter.type";
import { queryProfileMutation } from "@/queries/profile.query";
import AnimalCardModal from "@/entities/animalCardModal";
import { Types } from "mongoose";
import { species } from "@/constants/species";
const ACTIVE_DOMEN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN;

type Props = {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	shelters: ShelterType[];
	userId: Types.ObjectId;
};

const AddNewAnimal = ({ isOpen = false, setIsOpen, shelters, userId }: Props) => {
	// const species = useSpeciesStore((state) => state.species);
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
		formData.append("injuryDescription", injuryDescription);

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
			setIsOpen(false);
		}
	};

	const handleCloseClick = () => {
		setIsOpen(false);
	};
	return (
		<AnimalCardModal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			modalTitle={"Create new animal"}
			submitButtonTitle={"Submit"}
			closeButtonTitle={"Close"}
			shelters={shelters}
			handleSuccessSubmitClick={(value) => handleSuccessSubmitClick(value)}
			handleCloseClick={handleCloseClick}
			species={species || []}
		/>
	);
};

export default AddNewAnimal;
