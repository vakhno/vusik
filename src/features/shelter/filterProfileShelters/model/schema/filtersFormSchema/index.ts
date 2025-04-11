// zod
import * as z from "zod";

export const SearchProfileSheltersFiltersFormSchema = () => {
	return z.object({
		state: z.string().array(),
		city: z.string().array(),
	});
};
