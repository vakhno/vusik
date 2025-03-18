// tanstack
import { useMutation } from "@tanstack/react-query";
// shared
import { API_AUTH_SIGN_UP } from "@/shared/constants/routes";
// api
import {
	SuccessResponse as AuthSignUpSuccessResponse,
	ErrorResponse as AuthSignUpErrorResponse,
} from "@/app/api/auth/sign-up/route";
// features
import SignUpSchemaType from "@/features/auth/signUp/model/type/signUpFormSchema";
// entities
import { UserType } from "@/entities/profile/model/type/profile";
import convertSignUpSchemaToFormData from "@/features/auth/signUp/model/utils/convertSignUpSchemaToFormData";

const mutationFn = async (signUpFields: SignUpSchemaType) => {
	try {
		const formData = convertSignUpSchemaToFormData(signUpFields);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_AUTH_SIGN_UP}`, {
			method: "POST",
			body: formData,
		});
		const responseData = (await response.json()) as AuthSignUpSuccessResponse | AuthSignUpErrorResponse;
		const { success } = responseData;

		if (success) {
			const { data } = responseData;
			const { user } = data;

			return user;
		} else {
			const { error } = responseData;
			const { message } = error;

			throw new Error(message);
		}
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error(String(error));
		}
	}
};

type mutateProps = {
	onSuccess?: (user: UserType) => void;
	onError?: (error: string) => void;
};

export const querySignUp = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
	});
};
