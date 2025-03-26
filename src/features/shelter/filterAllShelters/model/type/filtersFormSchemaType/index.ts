import * as z from "zod";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/shelter/filterAllShelters/model/schema/filtersFormSchema";

type SearchAllSheltersFiltersFormSchemaType = z.infer<ReturnType<typeof SearchAllAnimalsFiltersFormSchema>>;

export default SearchAllSheltersFiltersFormSchemaType;
