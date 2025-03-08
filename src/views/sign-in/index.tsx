"use client";
// components
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import LogoWithSloganLink from "@/shared/shared/LogoWithSloganLink";
import TextBetweenSeparators from "@/shared/shared/TextBetweenSeparators";
// next tools
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";
// widgets
import GoogleAuth from "@/widget/googleAuth";
// features
import SignInForm from "@/features/auth/signIn/ui/signInForm";

const Index = () => {
	const t = useTranslations();

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-center">
					<LogoWithSloganLink href="/" width={140} />
				</div>
			</CardHeader>
			<CardContent>
				<div>
					<GoogleAuth />
					<TextBetweenSeparators text={t("separator.or")} className="my-4" />
					<SignInForm />
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex w-full justify-center">
					{t.rich("page.auth.sign-in.dont-have-an-account", {
						signUp: (chunks) => {
							return (
								<Link href="/auth/sign-up" className="font-bold">
									{chunks}
								</Link>
							);
						},
					})}
				</div>
			</CardFooter>
		</Card>
	);
};

export default Index;
