// zod
import * as z from "zod";
// constants
import { imageFileTypesAsArray } from "@/constants/files";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

export const NewShelterSchema = (t: TFunction) => {
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
		postalCode: z.string().min(1, { message: t("sign-up.schema-email-min") }),
		phone: z.string().min(1),
		workingDays: z.object({
			monday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
			tuesday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
			wednesday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
			thursday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
			friday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
			saturday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
			sunday: z.object({
				begin: z.string(),
				end: z.string(),
				isWeekend: z.boolean(),
			}),
		}),
		specificWeekends: z.array(
			z.object({
				month: z.string(), // storing as number 1-12 for months
				day: z.string(), // storig as number 1-31 for days
			}),
		),
	});
};

export type NewShelterSchemaType = z.infer<ReturnType<typeof NewShelterSchema>>;
