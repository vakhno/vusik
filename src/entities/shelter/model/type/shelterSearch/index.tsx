import * as z from "zod";
import { ShelterSearchSchema } from "@/entities/shelter/model/schema/shelterSearch";

export type ShelterSearchSchemaType = z.infer<ReturnType<typeof ShelterSearchSchema>>;
