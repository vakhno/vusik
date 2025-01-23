"use client";
// components
import { useToast } from "@/shared/ui/use-toast";
import { Form } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import FormInput from "@/shared/formUi/formInput";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// next tools
import { SignUpSchema } from "@/features/auth/signUp/model/schema";
import Link from "next/link";
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

const index = () => {
	const t = useTranslations();
	const signUpSchema = SignUpSchema(t);
	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<z.infer<typeof signUpSchema>>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = async (fields: z.infer<typeof signUpSchema>) => {
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

		const { ok } = response;

		if (ok) {
			const data: AuthSignUpSuccessResponse | AuthSignUpErrorResponse = await response.json();
			const { success } = data;

			if (success) {
				const { user } = data;

				setUser(user);

				router.push("/");
			} else {
				toast({
					title: "Error",
					description: `Something went wrong!`,
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Error",
				description: `Something went wrong!`,
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormInput
					control={form.control}
					label={t("sign-up.name-input-label")}
					name="name"
					placeholder={t("sign-up.name-input-placeholder")}
					description={t("sign-up.name-input-description")}
				/>
				<FormInput
					type="email"
					control={form.control}
					label={t("sign-up.email-input-label")}
					name="email"
					placeholder={t("sign-up.email-input-placeholder")}
				/>
				<FormInput
					type="password"
					control={form.control}
					label={t("sign-up.password-input-label")}
					name="password"
					placeholder={t("sign-up.password-input-placeholder")}
				/>
				<FormInput
					type="password"
					control={form.control}
					label={t("sign-up.confirm-password-input-label")}
					name="confirmPassword"
					placeholder={t("sign-up.confirm-password-input-placeholder")}
				/>
				<div className="mx-auto text-center">
					{t.rich("sign-up.sign-up-agreement", {
						termsOfUse: () => {
							return (
								<Link href="/terms-of-use" className="font-bold">
									{t("sign-up.sign-up-agreement-terms-of-use")}
								</Link>
							);
						},
						privacyPolicy: () => {
							return (
								<Link href="/privacy-policy" className="font-bold">
									{t("sign-up.sign-up-agreement-privacy-policy")}
								</Link>
							);
						},
					})}
				</div>
				<Button className="w-full" type="submit">
					{t("submit")}
				</Button>
			</form>
		</Form>
	);
};

export default index;
