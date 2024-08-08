"use client";
import { useRef, useState, useEffect } from "react";
// UI components
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// react-hook-form
import { useForm } from "react-hook-form";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// next tools
import SignUpSchema from "@/schemas/sign-up/sign-up.schema";
import useUserStore from "@/zustand/user/store/user.store";
// types
import {
	SuccessResponse as AuthSignUpSuccessResponse,
	ErrorResponse as AuthSignUpErrorResponse,
} from "@/app/api/auth/sign-up/route";
// next tools
import Image from "next/image";
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

interface Props {
	withAvatarUploading?: boolean;
}

const SignUpContent = ({ withAvatarUploading = false }: Props) => {
	const t = useTranslations();
	const signUpSchema = SignUpSchema({ t });
	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const { toast } = useToast();
	const [previewAvatar, setPreviewAvatar] = useState<undefined | string>(undefined);
	const [fileAvatar, setFileAvatar] = useState<null | File>(null);
	const avatarInputRef = useRef<HTMLInputElement>(null);
	const form = useForm<z.infer<typeof signUpSchema>>({
		defaultValues: {
			name: "",
			email: "",
			avatar: undefined,
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(signUpSchema),
	});

	useEffect(() => {
		const cleanUp = () => {
			previewAvatar && window.URL.revokeObjectURL(previewAvatar);
		};

		if (fileAvatar) {
			const urlFile = window.URL.createObjectURL(fileAvatar);

			setPreviewAvatar(urlFile);
		}

		return cleanUp;
	}, [fileAvatar, previewAvatar]);

	const onSubmit = async (fields: z.infer<typeof signUpSchema>) => {
		const { avatar, name, email, password, confirmPassword } = fields;
		const formData = new FormData();

		if (avatar) {
			formData.append("avatar", avatar);
		}

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

	const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.currentTarget && e?.currentTarget?.files && e?.currentTarget?.files[0];

		if (file) {
			form.setValue("avatar", file);
			setFileAvatar(file);
		}
	};

	const handleAvatarClick = () => {
		if (fileAvatar) {
			form.setValue("avatar", undefined);

			setPreviewAvatar(undefined);

			if (avatarInputRef?.current && avatarInputRef?.current?.value) {
				avatarInputRef.current.value = "";
			}
		} else {
			avatarInputRef && avatarInputRef?.current && avatarInputRef?.current.click();
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
					{withAvatarUploading ? (
						<Avatar className="group relative m-auto h-20 w-20 cursor-pointer" onClick={handleAvatarClick}>
							<AvatarImage src={previewAvatar} className="pointer-events-none group-hover:blur-md" />
							{previewAvatar ? (
								<Image
									width={26}
									height={26}
									src="/icons/close-circle-icon.svg"
									alt="Remove avatar icon"
									className="pointer-events-none invisible absolute z-10 h-full w-full items-center justify-center p-4 opacity-70 group-hover:visible"
								/>
							) : (
								<Image
									width={26}
									height={26}
									src="/icons/plus-circle-icon.svg"
									alt="Add avatar icon"
									className="pointer-events-none invisible absolute z-10 h-full w-full items-center justify-center p-4 opacity-70 group-hover:visible"
								/>
							)}
							<AvatarFallback className="pointer-events-none relative">
								<Image
									width={26}
									height={26}
									src="/icons/default-profile-icon.svg"
									alt="Add avatar icon"
									className="absolute h-full w-full items-center justify-center p-4 group-hover:hidden"
								/>
							</AvatarFallback>
						</Avatar>
					) : null}
					<input
						hidden
						type="file"
						ref={avatarInputRef}
						onChange={handleFileInputChange}
						accept="image/jpeg, image/png, image/webp, image/svg+xml, image/bmp, image/tiff"
					/>
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
