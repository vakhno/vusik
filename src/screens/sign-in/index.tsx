"use server";

// shared
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import SloganWithLogoLink from "@/shared/shared/SloganWithLogoLink";
import TextBetweenSeparators from "@/shared/shared/TextBetweenSeparators";
import { HOME_ROUTE, SIGN_UP_ROUTE } from "@/shared/constants/routes";
// next tools
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";
// features
import SignInForm from "@/features/auth/signIn/ui/signInForm";
import GoogleAuthButton from "@/features/auth/googleAuth/ui/googleAuthButton";

const Index = () => {
	const t = useTranslations();

	return (
		<Card>
			<CardHeader>
				<SloganWithLogoLink href={HOME_ROUTE} width={220} />
			</CardHeader>
			<CardContent>
				<div>
					<GoogleAuthButton />
					<TextBetweenSeparators text={t("separator.or")} className="my-4" />
					<SignInForm />
				</div>
			</CardContent>
			<CardFooter>
				<div className="mx-auto text-center">
					{t.rich("page.auth.sign-in.dont-have-an-account", {
						signUp: (chunks) => {
							return (
								<Link href={SIGN_UP_ROUTE} className="font-bold">
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
