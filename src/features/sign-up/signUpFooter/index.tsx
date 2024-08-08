"use client";
// shared
import TextWithLinkText from "@/components/shared/TextWithLinkText";
// next-intl
import { useTranslations } from "next-intl";

const SignUpFooter = () => {
	const t = useTranslations();

	return (
		<div className="flex w-full justify-center">
			<TextWithLinkText
				text={t("sign-up.have-an-account")}
				linkText={t("sign-up.have-an-account-redirection")}
				href="/auth/sign-in"
			/>
		</div>
	);
};

export default SignUpFooter;
