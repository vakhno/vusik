"use server";

// shared
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import SloganWithLogoLink from "@/shared/shared/SloganWithLogoLink";
import TextBetweenSeparators from "@/shared/shared/TextBetweenSeparators";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/shared/constants/routes";
// next tools
import Link from "next/link";
// next-intl
import { useTranslations } from "next-intl";
// features
import SignUpForm from "@/features/auth/signUp/ui/signUpForm";
import GoogleAuthButton from "@/features/auth/googleAuth/ui/googleAuthButton";

const Index = () => {
	const t = useTranslations();

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-center">
					<SloganWithLogoLink href={HOME_ROUTE} width={220} />
				</div>
			</CardHeader>
			<CardContent>
				<div>
					<GoogleAuthButton />
					<TextBetweenSeparators text={t("separator.or")} className="my-4" />
					<SignUpForm />
				</div>
			</CardContent>
			<CardFooter>
				<div className="mx-auto text-center">
					{t.rich("page.auth.sign-up.have-an-account", {
						signIn: (chunks) => {
							return (
								<Link href={SIGN_IN_ROUTE} className="font-bold">
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
