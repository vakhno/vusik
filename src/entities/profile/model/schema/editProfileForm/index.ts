// zod
import * as z from "zod";
// constants
import { imageFileTypesAsArray } from "@/constants/files";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export const EditUserSchema = (t: TFunction) => {
	return z.object({
		avatar: z
			.instanceof(File)
			.refine((file) => imageFileTypesAsArray.includes(file.type))
			.optional(),
		name: z
			.string()
			.trim()
			.min(1, { message: t("sign-up.schema-name-min") })
			.min(5, { message: t("sign-up.schema-name-short") }),
		facebook: z.string().trim().optional(),
		instagram: z.string().trim().optional(),
		telegram: z.string().trim().optional(),
		twitter: z.string().trim().optional(),
		youtube: z.string().trim().optional(),
	});
};
