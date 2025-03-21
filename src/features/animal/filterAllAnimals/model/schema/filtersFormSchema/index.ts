// zod
import * as z from "zod";

export const SearchAllAnimalsFiltersFormSchema = () => {
	return z.object({
		species: z.string().array().optional(),
		breed: z.string().array().optional(),
		sex: z.string().array().optional(),
		size: z.string().array().optional(),
		state: z.string().array().optional(),
		city: z.string().array().optional(),
		sterilized: z.boolean().optional(),
		injury: z.boolean().optional(),
	});
};
