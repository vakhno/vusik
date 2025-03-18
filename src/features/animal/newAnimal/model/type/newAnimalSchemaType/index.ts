// zod
import * as z from "zod";
// schema
import NewAnimalFormSchema from "@/features/animal/newAnimal/model/schema/newAnimalSchema";

type NewAnimalSchemaType = z.infer<ReturnType<typeof NewAnimalFormSchema>>;

export default NewAnimalSchemaType;
