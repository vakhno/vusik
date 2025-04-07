"use client";

// features
import AdoptSchemaType from "@/features/animal/adoptAnimal/model/type/adoptFormSchema";
import AdopAnimalFields from "@/features/animal/adoptAnimal/ui/adoptAnimalForm/fields";
// entities
import { AnimalType, PopulatedAnimalType } from "@/entities/animal/model/type/animal";
import { queryMutation_sendUserAdoptionRequestEmail } from "@/features/animal/adoptAnimal/model/query/userAdoptionRequest";
// shared
import { toast } from "sonner";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	onError: () => void;
	onSuccess: () => void;
	animal: AnimalType | PopulatedAnimalType;
};

const Index = ({ onSuccess, onError, animal }: Props) => {
	const t = useTranslations();

	const { mutateAsync: sendAdoptionRequest } = queryMutation_sendUserAdoptionRequestEmail({
		onSuccess: () => {
			onSuccess();
		},
		onError: (data) => {
			const { error } = data;
			const { message } = error;

			toast.error(t("page.auth.sign-up.error-toast-title"), {
				description: message,
			});
			onError();
		},
	});

	const onHandleSubmit = (value: AdoptSchemaType) => {
		const { name, email } = value;

		sendAdoptionRequest({ animal, userName: name, userEmail: email });
	};

	return <AdopAnimalFields onFormSubmit={onHandleSubmit} />;
};

export default Index;
