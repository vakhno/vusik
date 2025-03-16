"use client";

// entities
import NewAnimalSchemaType from "@/entities/animal/model/type/newAnimalForm";
// next-intl
import { useTranslations } from "next-intl";
// features
import EditAnimalFields from "@/features/animal/editAnimal/ui/editAnimalForm/formFields";
import { queryGetEditAnimalFilter } from "@/features/animal/editAnimal/model/query/fetchEditAnimalFilters";
import { queryEditAnimal } from "@/features/animal/editAnimal/model/query/editAnimal";
// mongoose
import { Types } from "mongoose";
// next tools
import { useRouter } from "next/navigation";
// shared
import { toast } from "sonner";

type Props = {
	animalId: Types.ObjectId;
};

const NewAnimal = ({ animalId }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const { data: fetchedFilters } = queryGetEditAnimalFilter({ id: animalId });
	const { mutateAsync: editAnimal } = queryEditAnimal({
		onSuccess: (animal) => {
			const { _id } = animal;

			router.push(`/animal/${_id}`);
		},
		onError: (error) => {
			toast.error(t("page.edit-animal.toast.title"), {
				description: error,
			});
		},
	});
	const availableOptions = fetchedFilters?.availableOptions || { shelters: [] };
	const selectedOptions = fetchedFilters?.selectedOptions || null;

	const onHandleFormSubmit = async (fields: NewAnimalSchemaType) => {
		const updatedFiedls = { ...fields, id: String(animalId) };

		editAnimal(updatedFiedls);
	};

	return (
		<EditAnimalFields
			availableOptions={availableOptions}
			selectedOptions={selectedOptions}
			handleSubmit={onHandleFormSubmit}
		/>
	);
};

export default NewAnimal;
