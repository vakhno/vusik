import * as z from "zod";
import { SignUpSchema } from "@/features/auth/signUp/model/schema/signUpForm";

export type SignUpSchemaType = z.infer<ReturnType<typeof SignUpSchema>>;
