// zod
import * as z from "zod";
// features
import SignUpSchema from "@/features/auth/signUp/model/schema/signUpForm";

type SignUpSchemaType = z.infer<ReturnType<typeof SignUpSchema>>;

export default SignUpSchemaType;
