// zod
import * as z from "zod";
// schema
import NewAnimalFormSchema from "@/entities/animal/model/schema/newAnimalForm";

type NewAnimalSchemaType = z.infer<ReturnType<typeof NewAnimalFormSchema>>;

export default NewAnimalSchemaType;
