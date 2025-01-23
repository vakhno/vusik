import * as z from "zod";
import { AnimalSearchSchema } from "@/features/animal/searchAnimal/model/schema";

export type AnimalSearchSchemaType = z.infer<ReturnType<typeof AnimalSearchSchema>>;
