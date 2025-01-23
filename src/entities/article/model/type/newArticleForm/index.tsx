import * as z from "zod";
import { NewArticleSchema } from "@/entities/article/model/schema/newArticleForm";

export type NewArticleSchemaType = z.infer<ReturnType<typeof NewArticleSchema>>;
