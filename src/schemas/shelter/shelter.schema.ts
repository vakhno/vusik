// zod
import * as z from "zod";
// constants
import { imageFileTypesAsArray } from "@/constants/files";
// next-intl
// import { TranslationValues } from "next-intl";

// type TFunction = (key: string, values?: TranslationValues) => string;

export const NewShelterSchema = () =>
	// t: TFunction
	{
		return z.object({
			mainPhoto: z
				.instanceof(File)
				.refine((file) => imageFileTypesAsArray.includes(file.type))
				.optional(),
			secondaryPhotos: z
				.array(z.instanceof(File))
				.refine((files) => files.every((file) => imageFileTypesAsArray.includes(file.type)))
				.optional(),
			name: z.string().trim().min(1, { message: "" }).max(20, { message: "" }),
			country: z.string().min(1),
			city: z.string().min(1),
			street: z.string(),
			coordinates: z.object({
				lat: z.number(),
				lng: z.number(),
			}),
			postalCode: z.string().min(1),
			phone: z.string().min(1),
		});
	};

export type NewShelterSchemaType = z.infer<ReturnType<typeof NewShelterSchema>>;
