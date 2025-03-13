"use client";

// entities
import NewAnimalSchemaType from "@/entities/animal/model/type/newAnimalForm";
// next-intl
import { useTranslations } from "next-intl";
// features
import NewAnimalFields from "@/features/animal/newAnimal/ui/newAnimalForm/newAnimalFields";
import { queryGetNewAnimalFilter } from "@/features/animal/newAnimal/model/query/fetchNewAnimalFilters";
import { queryNewAnimal } from "@/features/animal/newAnimal/model/query/addNewAnimal";
// mongoose
import { Types } from "mongoose";
// next tools
import { useRouter } from "next/navigation";
// shared
import { useToast } from "@/shared/ui/use-toast";

type Props = {
	userId: Types.ObjectId;
};

const NewAnimal = ({ userId }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const { toast } = useToast();
	const { data: fetchedFilters } = queryGetNewAnimalFilter({ id: userId });
	const { mutateAsync: addNewAnimal } = queryNewAnimal();
	const availableOptions = fetchedFilters?.availableOptions || { shelters: [] };

	const onHandleSubmit = async (fields: NewAnimalSchemaType) => {
		const result = await addNewAnimal(fields);

		if (result) {
			const { animal } = result;
			const { _id } = animal;

			router.push(`/animal/${_id}`);
		} else {
			toast({
				title: t("page.new-animal.toast.title"),
				description: t("page.new-animal.toast.description"),
				variant: "destructive",
			});
		}
	};

	return <NewAnimalFields availableOptions={availableOptions} handleSubmit={onHandleSubmit} />;
};

export default NewAnimal;
