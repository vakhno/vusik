// zod
import * as z from "zod";
// shared
import { imageFileTypesAsArray } from "@/shared/constants/files";
import { TFunction } from "@/shared/types/nextIntl.type";

export const EditUserSchema = (t: TFunction) => {
	return z.object({
		avatar: z
			.instanceof(File)
			.refine((file) => imageFileTypesAsArray.includes(file.type))
			.optional(),
		name: z
			.string()
			.trim()
			.min(1, { message: t("page.auth.sign-up.schema-name-min") })
			.min(5, { message: t("page.auth.sign-up.schema-name-short") }),
		facebook: z.string().trim().optional(),
		instagram: z.string().trim().optional(),
		telegram: z.string().trim().optional(),
		twitter: z.string().trim().optional(),
		youtube: z.string().trim().optional(),
	});
};
