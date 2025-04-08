// zod
import * as z from "zod";
// shared
import { TFunction } from "@/shared/types/nextIntl.type";

const AdoptAnimalSchema = (t: TFunction) => {
	return z.object({
		name: z
			.string()
			.min(1, { message: t("adopt.schema.name-min") })
			.min(5, { message: t("adopt.schema.name-short") }),
		email: z
			.string()
			.min(1, { message: t("adopt.schema.email-min") })
			.email({ message: t("adopt.schema.email-type") }),
	});
};

export default AdoptAnimalSchema;
