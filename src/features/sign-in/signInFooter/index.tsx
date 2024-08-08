// shared
import TextWithLinkText from "@/components/shared/TextWithLinkText";
// next-intl
import { useTranslations } from "next-intl";

const SignInFooter = () => {
	const t = useTranslations();

	return (
		<div className="flex w-full justify-center">
			<TextWithLinkText
				text={t("sign-in.dont-have-an-account")}
				linkText={t("sign-in.dont-have-an-account-redirection")}
				href="/auth/sign-up"
			/>
		</div>
	);
};

export default SignInFooter;
