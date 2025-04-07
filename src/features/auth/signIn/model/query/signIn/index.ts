// tanstack
import { useMutation } from "@tanstack/react-query";
// shared
import { NEXT_PUBLIC_ACTIVE_DOMEN } from "@/shared/constants/env";
import { API_AUTH_SIGN_IN } from "@/shared/constants/routes";
import convertObjectToFormData from "@/shared/utils/convertObjectToFormData";
// features
import SignInSchemaType from "@/features/auth/signIn/model/type/signInFormSchema";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/auth/sign-in/route";

type mutateProps = {
	onSuccess: (user: SuccessResponse["data"]["user"]) => void;
	onError: (error: ErrorResponse["error"]["message"]) => void;
};

const mutationFn = async (signInFields: SignInSchemaType) => {
	const formData = convertObjectToFormData(signInFields);
	const response = await fetch(`${NEXT_PUBLIC_ACTIVE_DOMEN}${API_AUTH_SIGN_IN}`, {
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

export const mutation_signIn = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
	});
};
