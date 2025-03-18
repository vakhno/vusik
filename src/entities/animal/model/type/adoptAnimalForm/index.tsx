// zod
import * as z from "zod";
// schema
import AdoptAnimalFormSchema from "@/entities/animal/model/schema/adoptAnimalForm";

type AdoptAnimalFormSchemaType = z.infer<ReturnType<typeof AdoptAnimalFormSchema>>;

export default AdoptAnimalFormSchemaType;
