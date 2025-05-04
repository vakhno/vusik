// zod
import * as z from "zod";
// shared
import { imageFileTypesAsArray } from "@/shared/constants/files";
import { TFunction } from "@/shared/types/nextIntl.type";

export const NewShelterSchema = (t: TFunction) => {
	const baseSchema = {
		mainPhoto: z
			.instanceof(File)
			.refine((file) => imageFileTypesAsArray.includes(file.type))
			.optional(),
		secondaryPhotos: z
			.array(z.instanceof(File))
			.refine((files) => files.every((file) => imageFileTypesAsArray.includes(file.type)))
			.optional(),
		name: z.string().trim().min(1, { message: "" }).max(40, { message: "" }),
		email: z.string().email(),
		phone: z.string().min(1),
		country: z.string().min(1),
		state: z.string().min(1),
		city: z.string().min(1),
		street: z.string(),
		coordinates: z.object({
			lat: z.number(),
			lng: z.number(),
		}),
		postalCode: z.string().min(1, { message: t("page.auth.sign-up.schema-email-min") }),
	};

	const commercialFields = {
		logo: z
			.instanceof(File)
			.refine((file) => imageFileTypesAsArray.includes(file.type))
			.optional(),
		losung: z.string().trim().min(1, { message: "" }).max(100, { message: "" }),
		story: z.string().trim().min(1, { message: "" }).max(300, { message: "" }),
		mission: z.string().trim().min(1, { message: "" }).max(300, { message: "" }),
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
				month: z.string(),
				day: z.string(),
			}),
		),
	};

	const charityFields = {
		logo: z
			.instanceof(File)
			.refine((file) => imageFileTypesAsArray.includes(file.type))
			.optional(),
		losung: z.string().trim().min(1, { message: "" }).max(100, { message: "" }),
		story: z.string().trim().min(1, { message: "" }).max(300, { message: "" }),
		mission: z.string().trim().min(1, { message: "" }).max(300, { message: "" }),
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
				month: z.string(),
				day: z.string(),
			}),
		),
	};

	const individualFields = {
		avatar: z
			.instanceof(File)
			.refine((file) => imageFileTypesAsArray.includes(file.type))
			.optional(),
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
	};

	return z.discriminatedUnion("type", [
		z.object({
			type: z.literal("commercial"),
			...baseSchema,
			...commercialFields,
		}),
		z.object({
			type: z.literal("charity"),
			...baseSchema,
			...charityFields,
		}),
		z.object({
			type: z.literal("individual"),
			...baseSchema,
			...individualFields,
		}),
	]);
};
