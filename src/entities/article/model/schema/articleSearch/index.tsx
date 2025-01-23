// zod
import * as z from "zod";
// next-intl
// import { TranslationValues } from "next-intl";

// type TFunction = (key: string, values?: TranslationValues) => string;

export const ArticleSearchSchema = () =>
	// t: TFunction
	{
		return z.object({
			category: z.string().array(),
		});
	};

export type ArticleSearchSchemaType = z.infer<ReturnType<typeof ArticleSearchSchema>>;
