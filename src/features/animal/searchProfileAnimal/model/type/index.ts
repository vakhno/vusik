import * as z from "zod";
import { AnimalProfileSearchSchema } from "@/features/animal/searchProfileAnimal/model/schema";

export type AnimalProfileSearchSchemaType = z.infer<ReturnType<typeof AnimalProfileSearchSchema>>;
