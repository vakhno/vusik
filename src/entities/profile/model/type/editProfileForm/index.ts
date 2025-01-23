import * as z from "zod";
import { EditUserSchema } from "@/entities/profile/model/schema/editProfileForm";

export type EditUserSchemaType = z.infer<ReturnType<typeof EditUserSchema>>;
