// features
import SignUpSchemaType from "@/features/auth/signUp/model/type/signUpFormSchema";

const convertSignUpSchemaToFormData = (signUpFields: SignUpSchemaType): FormData => {
	const { name, email, password, confirmPassword } = signUpFields;
	const formData = new FormData();

	formData.append("name", name);
	formData.append("email", email);
	formData.append("password", password);
	formData.append("confirmPassword", confirmPassword);

	return formData;
};

export default convertSignUpSchemaToFormData;
