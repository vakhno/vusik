// zod
import * as z from "zod";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

const AdoptAnimalSchema = (t: TFunction) => {
	return z.object({
		name: z
			.string()
			.min(1, { message: t("page.auth.sign-up.schema-name-min") })
			.min(5, { message: t("page.auth.sign-up.schema-name-short") }),
		email: z
			.string()
			.min(1, { message: t("page.auth.sign-up.schema-email-min") })
			.email({ message: t("page.auth.sign-up.schema-email-type") }),
	});
};

export default AdoptAnimalSchema;
