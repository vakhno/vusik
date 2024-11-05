// zod
import * as z from "zod";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export const SignInSchema = (t: TFunction) => {
	return z.object({
		email: z
			.string()
			.min(1, { message: t ? t("sign-in.schema-email-min") : "" })
			.email({ message: t ? t("sign-in.schema-email-type") : "" }),
		password: z.string().min(1, { message: t ? t("sign-in.schema-password-min") : "" }),
	});
};

export type SignInSchemaType = z.infer<ReturnType<typeof SignInSchema>>;
