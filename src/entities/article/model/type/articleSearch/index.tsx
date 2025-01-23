import * as z from "zod";
import { ArticleSearchSchema } from "@/entities/article/model/schema/articleSearch";

export type ArticleSearchSchemaType = z.infer<ReturnType<typeof ArticleSearchSchema>>;
