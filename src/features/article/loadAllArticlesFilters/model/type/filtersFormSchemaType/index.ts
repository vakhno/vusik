import * as z from "zod";
import { SearchAllArticlesFiltersFormSchema } from "@/features/article/loadAllArticlesFilters/model/schema/filtersFormSchema";

export type SearchAllArticlesFiltersFormSchemaType = z.infer<ReturnType<typeof SearchAllArticlesFiltersFormSchema>>;
