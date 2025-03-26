// zod
import * as z from "zod";

export const SearchAllAnimalsFiltersFormSchema = () => {
	return z.object({
		state: z.string().array(),
		city: z.string().array(),
	});
};
