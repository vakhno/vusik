"use client";

// shared
import { Form } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import FormInput from "@/shared/formUi/formInput";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// next tools
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";
// features
import { SignUpSchemaType } from "@/features/auth/signUp/model/type/signUpFormSchema";
import { SignUpSchema } from "@/features/auth/signUp/model/schema/signUpForm";

type Props = {
	onFormSubmit: (value: SignUpSchemaType) => void;
};

const index = ({ onFormSubmit }: Props) => {
	const t = useTranslations();
	const signUpSchema = SignUpSchema(t);
	const form = useForm<SignUpSchemaType>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(signUpSchema),
	});

	const onHandleSubmit = (value: SignUpSchemaType) => {
		onFormSubmit(value);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-8">
				<FormInput
					control={form.control}
					label={t("page.auth.sign-up.name-input-label")}
					name="name"
					placeholder={t("page.auth.sign-up.name-input-placeholder")}
					description={t("page.auth.sign-up.name-input-description")}
				/>
				<FormInput
					type="email"
					control={form.control}
					label={t("page.auth.sign-up.email-input-label")}
					name="email"
					placeholder={t("page.auth.sign-up.email-input-placeholder")}
				/>
				<FormInput
					type="password"
					control={form.control}
					label={t("page.auth.sign-up.password-input-label")}
					name="password"
					placeholder={t("page.auth.sign-up.password-input-placeholder")}
				/>
				<FormInput
					type="password"
					control={form.control}
					label={t("page.auth.sign-up.confirm-password-input-label")}
					name="confirmPassword"
					placeholder={t("page.auth.sign-up.confirm-password-input-placeholder")}
				/>
				<div className="mx-auto text-center">
					{t.rich("page.auth.sign-up.sign-up-agreement", {
						termsOfUse: () => {
							return (
								<Link href="/terms-of-use" className="font-bold">
									{t("page.auth.sign-up.sign-up-agreement-terms-of-use")}
								</Link>
							);
						},
						privacyPolicy: () => {
							return (
								<Link href="/privacy-policy" className="font-bold">
									{t("page.auth.sign-up.sign-up-agreement-privacy-policy")}
								</Link>
							);
						},
					})}
				</div>
				<Button className="w-full" type="submit">
					{t("page.auth.sign-up.submit")}
				</Button>
			</form>
		</Form>
	);
};

export default index;
