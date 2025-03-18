// zod
import * as z from "zod";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

const SignInSchema = (t: TFunction) => {
	return z.object({
		email: z
			.string()
			.min(1, { message: t ? t("page.auth.sign-in.schema.email-min") : "" })
			.email({ message: t ? t("page.auth.sign-in.schema.email-type") : "" }),
		password: z.string().min(5, { message: t ? t("page.auth.sign-in.schema.password-min") : "" }),
	});
};

export default SignInSchema;
