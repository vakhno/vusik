// zod
import * as z from "zod";
// next-intl
// import { TranslationValues } from "next-intl";

// type TFunction = (key: string, values?: TranslationValues) => string;

export const ShelterSearchSchema = () =>
	// t: TFunction
	{
		return z.object({
			city: z.string().array(),
			state: z.string().array(),
		});
	};
