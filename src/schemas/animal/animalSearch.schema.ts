// zod
import * as z from "zod";
// next-intl
// import { TranslationValues } from "next-intl";

// type TFunction = (key: string, values?: TranslationValues) => string;

export const AnimalSearchSchema = () =>
	// t: TFunction
	{
		return z.object({
			species: z.string().array(),
			breed: z.string().array(),
			sex: z.string().array(),
			age: z.string().array(),
			size: z.string().array(),
			shelter: z.string().array(),
			sterilized: z.boolean(),
			injury: z.boolean(),
		});
	};

export type AnimalSearchSchemaType = z.infer<ReturnType<typeof AnimalSearchSchema>>;
