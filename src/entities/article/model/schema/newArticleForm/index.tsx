// zod
import * as z from "zod";
// constants
import { imageFileTypesAsArray } from "@/shared/constants/files";
// next-intl
// import { TranslationValues } from "next-intl";

// type TFunction = (key: string, values?: TranslationValues) => string;

export const NewArticleSchema = () =>
	// t: TFunction
	{
		return z.object({
			image: z
				.instanceof(File)
				.refine((file) => imageFileTypesAsArray.includes(file.type))
				.optional(),
			title: z.string().trim().min(1, { message: "" }).max(20, { message: "" }),
			category: z.string().min(1),
			text: z.string().trim().min(100, { message: "" }).max(200, { message: "" }),
		});
	};
