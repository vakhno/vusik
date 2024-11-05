"use client";
// UI components
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// next tools
import { SignUpSchema } from "@/schemas/sign-up/sign-up.schema";
import useUserStore from "@/zustand/store/user.store";
// types
import {
	SuccessResponse as AuthSignUpSuccessResponse,
	ErrorResponse as AuthSignUpErrorResponse,
} from "@/app/api/auth/sign-up/route";
// next tools
import { useRouter } from "next/navigation";
// routes
import { API_AUTH_SIGN_UP, HOME_ROUTE, SIGN_UP_ROUTE } from "@/routes";
// next-intl
import { useTranslations } from "next-intl";
// widgets
import GoogleAuth from "@/widget/googleAuth";
// shared
import TextBetweenSeparators from "@/components/shared/TextBetweenSeparators";
import TextWithLinkText from "@/components/shared/TextWithLinkText";

const ACTIVE_DOMEN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN;
const AUTH_SUCCESS_REDIRECT_SIGN_UP = process.env.NEXT_PUBLIC_ACTIVE_DOMEN + HOME_ROUTE;
const AUTH_FAILED_REDIRECT_SIGN_UP = process.env.NEXT_PUBLIC_ACTIVE_DOMEN + SIGN_UP_ROUTE;

const SignUpContent = () => {
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

		const response = await fetch(`${ACTIVE_DOMEN}${API_AUTH_SIGN_UP}`, {
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
		<div>
			<GoogleAuth
				successRedirection={AUTH_SUCCESS_REDIRECT_SIGN_UP}
				errorRedirection={AUTH_FAILED_REDIRECT_SIGN_UP}
			/>
			<TextBetweenSeparators text={t("separator.or")} className="my-4" />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sign-up.name-input-label")}</FormLabel>
								<FormControl>
									<Input placeholder={t("sign-up.name-input-placeholder")} {...field} />
								</FormControl>
								<FormDescription>{t("sign-up.name-input-description")}</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sign-up.email-input-label")}</FormLabel>
								<FormControl>
									<Input type="email" placeholder={t("sign-up.email-input-placeholder")} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sign-up.password-input-label")}</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder={t("sign-up.password-input-placeholder")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sign-up.confirm-password-input-label")}</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder={t("sign-up.confirm-password-input-placeholder")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<TextWithLinkText
						text={t("sign-up.agree-with-terms-of-use")}
						linkText={t("sign-up.terms-of-use")}
						href="/use-of-terms"
					/>
					<Button className="w-full" type="submit">
						{t("submit")}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default SignUpContent;
