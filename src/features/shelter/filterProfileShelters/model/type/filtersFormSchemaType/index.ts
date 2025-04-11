import * as z from "zod";
import { SearchProfileSheltersFiltersFormSchema } from "@/features/shelter/filterProfileShelters/model/schema/filtersFormSchema";

export type SearchProfileSheltersFiltersFormSchemaType = z.infer<ReturnType<typeof SearchProfileSheltersFiltersFormSchema>>;
