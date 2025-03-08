"use client";

// shared
import { useToast } from "@/shared/ui/use-toast";
// next tools
import { useRouter } from "next/navigation";
// zustand
import useUserStore from "@/zustand/store/user.store";
// routes
import { API_AUTH_SIGN_IN } from "@/routes";
// types
import {
	SuccessResponse as AuthSignInSuccessResponse,
	ErrorResponse as AuthSignInErrorResponse,
} from "@/app/api/auth/sign-in/route";
// next-intl
import { useTranslations } from "next-intl";
// features
import SignInFields from "@/features/auth/signIn/ui/signInForm/signInFields";
import { SignInSchemaType } from "@/features/auth/signIn/model/type/signInFormSchema";

const Index = () => {
	const t = useTranslations();
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const { toast } = useToast();

	const onHandleFormSubmit = async (fields: SignInSchemaType) => {
		const { email, password } = fields;
		const formData = new FormData();

		formData.append("email", email);
		formData.append("password", password);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_AUTH_SIGN_IN}`, {
			method: "POST",
			body: formData,
		});

		const data: AuthSignInSuccessResponse | AuthSignInErrorResponse = await response.json();
		const { success } = data;

		if (success) {
			const { user } = data;

			setUser(user);

			router.push("/");
		} else {
			const { error } = data;

			toast({
				title: t("page.auth.sign-in.error-toast-title"),
				description: error,
				variant: "destructive",
			});
		}
	};

	return <SignInFields onFormSubmit={onHandleFormSubmit} />;
};

export default Index;
