import * as z from "zod";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/animal/filterAllAnimals/model/schema/filtersFormSchema";

type SearchAllAnimalsFiltersFormSchemaType = z.infer<ReturnType<typeof SearchAllAnimalsFiltersFormSchema>>;

export default SearchAllAnimalsFiltersFormSchemaType;
