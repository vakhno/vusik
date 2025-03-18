// zod
import * as z from "zod";
// features
import AdoptFormSchema from "@/features/animal/adoptAnimal/model/schema/adoptForm";

type AdoptFormSchemaType = z.infer<ReturnType<typeof AdoptFormSchema>>;

export default AdoptFormSchemaType;
