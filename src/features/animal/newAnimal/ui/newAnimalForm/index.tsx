"use client";

// entities
import NewAnimalSchemaType from "@/features/animal/newAnimal/model/type/newAnimalSchemaType";
// next-intl
import { useTranslations } from "next-intl";
// features
import NewAnimalFields from "@/features/animal/newAnimal/ui/newAnimalForm/newAnimalFields";
import { queryGetNewAnimalFilter } from "@/features/animal/newAnimal/model/query/fetchNewAnimalFilters";
import { queryNewAnimal } from "@/features/animal/newAnimal/model/query/addNewAnimal";
// next tools
import { useRouter } from "next/navigation";
// shared
import { toast } from "sonner";

type Props = {
	userId: string;
};

const NewAnimal = ({ userId }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const { data: fetchedFilters } = queryGetNewAnimalFilter({ id: userId });
	const { mutateAsync: addNewAnimal } = queryNewAnimal();
	const availableOptions = fetchedFilters?.availableOptions?.shelters || { shelters: [] };

	const onHandleSubmit = async (fields: NewAnimalSchemaType) => {
		const result = await addNewAnimal(fields);

		if (result) {
			const { animal } = result;
			const { _id } = animal;

			router.push(`/animal/${_id}`);
		} else {
			toast.error(t("page.new-animal.toast.title"), {
				description: t("page.new-animal.toast.description"),
			});
		}
	};

	return <NewAnimalFields availableOptions={availableOptions} handleSubmit={onHandleSubmit} />;
};

export default NewAnimal;
