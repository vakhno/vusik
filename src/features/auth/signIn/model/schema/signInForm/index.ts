// zod
import * as z from "zod";
// shared
import { TFunction } from "@/shared/types/nextIntl.type";

const SignInSchema = (t: TFunction) => {
	return z.object({
		email: z
			.string()
			.min(1, { message: t("page.auth.sign-in.schema.email-min") })
			.email({ message: t("page.auth.sign-in.schema.email-type") }),
		password: z.string().min(5, { message: t("page.auth.sign-in.schema.password-min") }),
	});
};

export default SignInSchema;
