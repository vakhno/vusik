import { SignInSchema } from "@/features/auth/signIn/model/schema/signInForm";
import * as z from "zod";

export type SignInSchemaType = z.infer<ReturnType<typeof SignInSchema>>;
