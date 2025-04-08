// tanstack
import { useMutation } from "@tanstack/react-query";
// features
import { SuccessResult, ErrorResult } from "@/features/animal/adoptAnimal/api/adoptAnimalRequest";
import { AnimalType, PopulatedAnimalType } from "@/entities/animal/model/type/animal";

// api
import { SuccessResponse, ErrorResponse } from "@/app/api/ses/send-email/route";
// shared
import { getCurrentYear } from "@/shared/utils/getCurrentYear";
import { UserAdoptionRequestEmail } from "@/shared/utils/emails";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { MAIN_LOGO } from "@/shared/constants/public";
import { API_S3_SES_SEND_EMAIL } from "@/shared/constants/routes";
import { TFunction } from "@/shared/types/nextIntl.type";
// next-intl
import { getLocale, getTranslations } from "next-intl/server";

type mutateProps = {
	onSuccess?: (data: SuccessResult) => void;
	onError?: (data: ErrorResult) => void;
};

type mutateFnProps = {
	animal: AnimalType | PopulatedAnimalType;
	userName: string;
	userEmail: string;
};

const mutationFn = async ({ animal, userName, userEmail }: mutateFnProps) => {
	const locale = await getLocale();
	const t = (await getTranslations({ locale })) as TFunction;
	const emailData = UserAdoptionRequestEmail({
		logo: `${NEXT_PUBLIC_ACTIVE_DOMEN}${MAIN_LOGO}`,
		userName,
		animalName: animal.name,
		animalImageURL: animal.mainPhoto,
		currentYear: getCurrentYear(),
		t,
	});
	const formData = new FormData();

	formData.append("email", userEmail);
	formData.append("subject", emailData.subject);
	formData.append("body", emailData.body);

	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_S3_SES_SEND_EMAIL}`, {
		method: "POST",
		body: formData,
	});
	const data = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = data;

	if (!success) {
		throw data;
	}

	return data;
};

export const queryMutation_sendUserAdoptionRequestEmail = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
	});
};
