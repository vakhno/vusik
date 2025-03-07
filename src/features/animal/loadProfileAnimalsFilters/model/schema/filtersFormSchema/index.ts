// zod
import * as z from "zod";

export const SearchAllAnimalsFiltersFormSchema = () => {
	return z.object({
		species: z.string().array(),
		breed: z.string().array(),
		sex: z.string().array(),
		size: z.string().array(),
		state: z.string().array(),
		city: z.string().array(),
		sterilized: z.boolean(),
		injury: z.boolean(),
	});
};
