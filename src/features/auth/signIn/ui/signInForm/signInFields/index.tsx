"use client";

// shared
import { Form } from "@/shared/ui/form";
import FormInput from "@/shared/formUi/formInput";
import { Button } from "@/shared/ui/button";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// features
import { SignInSchema } from "@/features/auth/signIn/model/schema/signInForm";
import { SignInSchemaType } from "@/features/auth/signIn/model/type/signInFormSchema";
// next tools
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	onFormSubmit: (value: SignInSchemaType) => void;
};

const index = ({ onFormSubmit }: Props) => {
	const t = useTranslations();
	const signInSchema = SignInSchema(t);
	const form = useForm<SignInSchemaType>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(signInSchema),
	});

	const onHandleSubmit = (value: SignInSchemaType) => {
		onFormSubmit(value);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onHandleSubmit)} className="space-y-8">
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
					{t("page.auth.sign-in.submit")}
				</Button>
			</form>
		</Form>
	);
};

export default index;
