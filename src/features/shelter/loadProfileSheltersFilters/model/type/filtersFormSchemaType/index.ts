import * as z from "zod";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/shelter/filterAllShelters/model/schema/filtersFormSchema";

export type SearchAllAnimalsFiltersFormSchemaType = z.infer<ReturnType<typeof SearchAllAnimalsFiltersFormSchema>>;
