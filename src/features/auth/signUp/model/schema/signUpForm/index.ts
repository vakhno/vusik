// zod
import * as z from "zod";
// shared
import { TFunction } from "@/shared/types/nextIntl.type";

const SignUpSchema = (t: TFunction) => {
	return z
		.object({
			name: z
				.string()
				.min(1, { message: t("page.auth.sign-up.schema.name-min") })
				.min(5, { message: t("page.auth.sign-up.schema.name-short") }),
			email: z
				.string()
				.min(1, { message: t("page.auth.sign-up.schema.email-min") })
				.email({ message: t("page.auth.sign-up.schema.email-type") }),
			password: z.string().min(1, { message: t("page.auth.sign-up.schema.password-min") }),
			confirmPassword: z.string().min(1, {
				message: t("page.auth.sign-up.schema.confirm-password-min"),
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			path: ["confirmPassword"],
			message: t("page.auth.sign-up.schema.passwords-match"),
		});
};

export default SignUpSchema;
