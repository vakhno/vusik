// zod
import * as z from "zod";

export const SearchAllArticlesFiltersFormSchema = () => {
	return z.object({
		category: z.string().array(),
	});
};
