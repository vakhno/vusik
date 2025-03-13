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
import { useToast } from "@/shared/ui/use-toast";

type Props = {
	animalId: Types.ObjectId;
};

const NewAnimal = ({ animalId }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const { toast } = useToast();
	const { data: fetchedFilters } = queryGetEditAnimalFilter({ id: animalId });
	const { mutateAsync: editAnimal } = queryEditAnimal();
	const availableOptions = fetchedFilters?.availableOptions || { shelters: [] };
	const selectedOptions = fetchedFilters?.selectedOptions || null;

	const onHandleSubmit = async (fields: NewAnimalSchemaType) => {
		const result = await editAnimal({ ...fields, id: String(animalId) });
		if (result) {
			const { animal } = result;
			console.log("result", result);
			const { _id } = animal;
			router.push(`/animal/${_id}`);
		} else {
			toast({
				title: t("page.edit-animal.toast.title"),
				description: t("page.edit-animal.toast.description"),
				variant: "destructive",
			});
		}
	};

	return (
		<EditAnimalFields
			availableOptions={availableOptions}
			selectedOptions={selectedOptions}
			handleSubmit={onHandleSubmit}
		/>
	);
};

export default NewAnimal;
