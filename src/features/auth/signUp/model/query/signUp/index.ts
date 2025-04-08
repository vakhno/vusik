// tanstack
import { useMutation } from "@tanstack/react-query";
// shared
import { API_AUTH_SIGN_UP } from "@/shared/constants/routes";
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import convertObjectToFormData from "@/shared/utils/convertObjectToFormData";
// features
import SignUpSchemaType from "@/features/auth/signUp/model/type/signUpFormSchema";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/auth/sign-up/route";

type mutateProps = {
	onSuccess: (user: SuccessResponse["data"]["user"]) => void;
	onError: (error: ErrorResponse["error"]["message"]) => void;
};

const mutationFn = async (signUpFields: SignUpSchemaType) => {
	const formData = convertObjectToFormData(signUpFields);
	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_AUTH_SIGN_UP}`, {
		method: "POST",
		body: formData,
	});
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (!success) {
		const {
			error: { message },
		} = result;

		throw new Error(message);
	}

	const {
		data: { user },
	} = result;

	return user;
};

export const mutation_signUp = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
	});
};
