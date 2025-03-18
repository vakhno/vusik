// zod
import * as z from "zod";
// schema
import EditAnimalFormSchema from "@/features/animal/editAnimal/model/schema/editAnimalSchema";

type EditAnimalSchemaType = z.infer<ReturnType<typeof EditAnimalFormSchema>>;

export default EditAnimalSchemaType;
