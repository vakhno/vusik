// tanstack
import { useMutation } from "@tanstack/react-query";
// shared
import { API_AUTH_SIGN_IN } from "@/shared/constants/routes";
// api
import {
	SuccessResponse as AuthSignInSuccessResponse,
	ErrorResponse as AuthSignInErrorResponse,
} from "@/app/api/auth/sign-in/route";
// features
import SignInSchemaType from "@/features/auth/signIn/model/type/signInFormSchema";
import convertSignInSchemaToFormData from "@/features/auth/signIn/model/utils/convertSignInSchemaToFormData";
// entities
import { UserType } from "@/entities/profile/model/type/profile";

const mutationFn = async (signInFields: SignInSchemaType) => {
	try {
		const formData = convertSignInSchemaToFormData(signInFields);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_AUTH_SIGN_IN}`, {
			method: "POST",
			body: formData,
		});
		const responseData = (await response.json()) as AuthSignInSuccessResponse | AuthSignInErrorResponse;
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

export const querySignIn = ({ onSuccess, onError }: mutateProps) => {
	return useMutation({
		mutationFn,
		onSuccess,
		onError,
	});
};
