// zod
import * as z from "zod";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export const SignUpSchema = (t: TFunction) => {
	return z
		.object({
			name: z
				.string()
				.min(1, { message: t("sign-up.schema-name-min") })
				.min(5, { message: t("sign-up.schema-name-short") }),
			email: z
				.string()
				.min(1, { message: t("sign-up.schema-email-min") })
				.email({ message: t("sign-up.schema-email-type") }),
			password: z.string().min(1, { message: t("sign-up.schema-password-min") }),
			confirmPassword: z.string().min(1, {
				message: t("sign-up.schema-confirm-password-min"),
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			path: ["confirmPassword"],
			message: t("sign-up.schema-passwords-match"),
		});
};
