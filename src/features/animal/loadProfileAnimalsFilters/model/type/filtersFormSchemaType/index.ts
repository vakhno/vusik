import * as z from "zod";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/animal/loadAllAnimalsFilters/model/schema/filtersFormSchema";

export type SearchAllAnimalsFiltersFormSchemaType = z.infer<ReturnType<typeof SearchAllAnimalsFiltersFormSchema>>;
