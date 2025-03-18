// features
import SignUpSchemaType from "@/features/auth/signUp/model/type/signUpFormSchema";

const convertFormDataToSignUpSchema = (formData: FormData): SignUpSchemaType => {
	const data = {
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	};

	if (formData.has("name")) {
		data.name = String(formData.get("name"));
	}

	if (formData.has("email")) {
		data.email = String(formData.get("email"));
	}

	if (formData.has("password")) {
		data.password = String(formData.get("password"));
	}

	if (formData.has("confirmPassword")) {
		data.confirmPassword = String(formData.get("confirmPassword"));
	}

	return data;
};

export default convertFormDataToSignUpSchema;
