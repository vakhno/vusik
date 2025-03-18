// features
import SignInSchemaType from "@/features/auth/signIn/model/type/signInFormSchema";

const convertSignInSchemaToFormData = (signInFields: SignInSchemaType): FormData => {
	const { email, password } = signInFields;
	const formData = new FormData();

	formData.append("email", email);
	formData.append("password", password);

	return formData;
};

export default convertSignInSchemaToFormData;
