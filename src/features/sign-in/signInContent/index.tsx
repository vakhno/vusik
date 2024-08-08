"use client";
// UI components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import SignInSchema from "@/schemas/sign-in/sign-in.schema";
import { z } from "zod";
// next tools
import { useRouter } from "next/navigation";
// zustand
import useUserStore from "@/zustand/user/store/user.store";
// routes
import { HOME_ROUTE, SIGN_IN_ROUTE, API_AUTH_SIGN_IN } from "@/routes";
// types
import {
	SuccessResponse as AuthSignInSuccessResponse,
	ErrorResponse as AuthSignInErrorResponse,
} from "@/app/api/auth/sign-in/route";
// shared
import TextBetweenSeparators from "@/components/shared/TextBetweenSeparators";
import TextWithLinkText from "@/components/shared/TextWithLinkText";
// next-intl
import { useTranslations } from "next-intl";
// widgets
import GoogleAuth from "@/widget/googleAuth";

const ACTIVE_DOMEN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN;
const AUTH_SUCCESS_REDIRECT_SIGN_IN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN + HOME_ROUTE;
const AUTH_FAILED_REDIRECT_SIGN_IN = process.env.NEXT_PUBLIC_ACTIVE_DOMEN + SIGN_IN_ROUTE;

const SignInContent = () => {
	const t = useTranslations();
	const signInSchema = SignInSchema({ t });
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

		const response = await fetch(`${ACTIVE_DOMEN}${API_AUTH_SIGN_IN}`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data: AuthSignInSuccessResponse | AuthSignInErrorResponse = await response.json();
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
				successRedirection={AUTH_SUCCESS_REDIRECT_SIGN_IN}
				errorRedirection={AUTH_FAILED_REDIRECT_SIGN_IN}
			/>
			<TextBetweenSeparators text={t("separator.or")} className="my-4" />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("sign-in.email-input-label")}</FormLabel>
								<FormControl>
									<Input type="email" placeholder={t("sign-in.email-input-placeholder")} {...field} />
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
								<FormLabel>{t("sign-in.password-input-label")}</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder={t("sign-in.password-input-placeholder")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<TextWithLinkText
						text={t("sign-in.agree-with-terms-of-use")}
						linkText={t("sign-in.terms-of-use")}
						href="/use-of-terms"
					/>
					<Button type="submit" className="w-full justify-center">
						{t("submit")}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default SignInContent;
