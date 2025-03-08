"use client";

// shared
import { useToast } from "@/shared/ui/use-toast";
// types
import {
	SuccessResponse as AuthSignUpSuccessResponse,
	ErrorResponse as AuthSignUpErrorResponse,
} from "@/app/api/auth/sign-up/route";
// next tools
import { useRouter } from "next/navigation";
// routes
import { API_AUTH_SIGN_UP } from "@/routes";
// next-intl
import { useTranslations } from "next-intl";
// zustand
import useUserStore from "@/zustand/store/user.store";
// features
import SignUpFields from "@/features/auth/signUp/ui/signUpForm/signUpFields";
import { SignUpSchemaType } from "@/features/auth/signUp/model/type/signUpFormSchema";

const index = () => {
	const t = useTranslations();
	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const { toast } = useToast();

	const onHandleSubmit = async (fields: SignUpSchemaType) => {
		const { name, email, password, confirmPassword } = fields;
		const formData = new FormData();

		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("confirmPassword", confirmPassword);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_AUTH_SIGN_UP}`, {
			method: "POST",
			body: formData,
		});

		const data: AuthSignUpSuccessResponse | AuthSignUpErrorResponse = await response.json();
		const { success } = data;

		if (success) {
			const { user } = data;

			setUser(user);

			router.push("/");
		} else {
			const { error } = data;

			toast({
				title: t("page.auth.sign-up.error-toast-title"),
				description: error,
				variant: "destructive",
			});
		}
	};

	return <SignUpFields onFormSubmit={onHandleSubmit} />;
};

export default index;
