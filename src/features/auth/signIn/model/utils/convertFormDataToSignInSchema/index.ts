// features
import SignInSchemaType from "@/features/auth/signIn/model/type/signInFormSchema";

const convertFormDataToSignInSchema = (formData: FormData): SignInSchemaType => {
	const data = { email: "", password: "" };

	if (formData.has("email")) {
		data.email = String(formData.get("email"));
	}

	if (formData.has("password")) {
		data.password = String(formData.get("password"));
	}

	return data;
};

export default convertFormDataToSignInSchema;
