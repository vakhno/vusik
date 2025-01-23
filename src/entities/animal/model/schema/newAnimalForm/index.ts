// zod
import * as z from "zod";
// constants
import { imageFileTypesAsArray } from "@/constants/files";
// next-intl
import { TranslationValues } from "next-intl";

type TFunction = (key: string, values?: TranslationValues) => string;

const NewAnimalSchema = (t: TFunction) => {
	return z
		.object({
			mainPhoto: z
				.instanceof(File)
				.refine((file) => imageFileTypesAsArray.includes(file.type))
				.optional(),
			secondaryPhotos: z
				.array(z.instanceof(File))
				.default([])
				.refine((files) => files.every((file) => imageFileTypesAsArray.includes(file.type)))
				.optional(),
			name: z.string().trim().min(1, { message: "" }).max(40, { message: "" }),
			breed: z.string().min(1),
			shelterId: z.string().min(1),
			size: z.string().min(1, { message: t("sign-up.schema-email-min") }),
			sex: z.string().min(1),
			species: z.string().min(1),
			sterilized: z.boolean(),
			injury: z.boolean().optional(),
			injuryDescription: z.string().optional(),
			age: z.string().refine((val) => +val && +val > 0),
		})
		.refine(
			(data) => {
				// if injury selected then injuryDescription is required
				if (data.injury) {
					return (
						data.injuryDescription &&
						data.injuryDescription.length >= 5 &&
						data.injuryDescription.length <= 250
					);
				}
				return true;
			},
			{
				path: ["injuryDescription"],
			},
		);
};

export default NewAnimalSchema;
