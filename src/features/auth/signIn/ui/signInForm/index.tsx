"use client";
// components
import { Form } from "@/shared/ui/form";
import FormInput from "@/shared/formUi/formInput";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/ui/use-toast";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/features/auth/signIn/model/schema";
import { z } from "zod";
// next tools
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const index = () => {
	const t = useTranslations();
	const signInSchema = SignInSchema(t);
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof signInSchema>>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = async (fields: z.infer<typeof signInSchema>) => {
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
				title: "Error",
				description: error,
				variant: "destructive",
			});
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormInput
					control={form.control}
					label={t("page.auth.sign-in.email-input-label")}
					name="email"
					placeholder={t("page.auth.sign-in.email-input-placeholder")}
					type="email"
				/>
				<FormInput
					control={form.control}
					label={t("page.auth.sign-in.password-input-label")}
					name="password"
					placeholder={t("page.auth.sign-in.password-input-placeholder")}
					type="password"
				/>
				<div className="mx-auto text-center">
					{t.rich("page.auth.sign-in.sign-in-agreement", {
						termsOfUse: (chunks) => {
							return (
								<Link href="/terms-of-use" className="font-bold">
									{chunks}
								</Link>
							);
						},
						privacyPolicy: (chunks) => {
							return (
								<Link href="/privacy-policy" className="font-bold">
									{chunks}
								</Link>
							);
						},
					})}
				</div>
				<Button type="submit" className="w-full justify-center">
					{t("submit")}
				</Button>
			</form>
		</Form>
	);
};

export default index;
