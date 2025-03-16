// zod
import * as z from "zod";
// features
import SignInSchema from "@/features/auth/signIn/model/schema/signInForm";

type SignInSchemaType = z.infer<ReturnType<typeof SignInSchema>>;

export default SignInSchemaType;
