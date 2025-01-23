import * as z from "zod";
import { NewShelterSchema } from "@/entities/shelter/model/schema/newShelterForm";

export type NewShelterSchemaType = z.infer<ReturnType<typeof NewShelterSchema>>;
