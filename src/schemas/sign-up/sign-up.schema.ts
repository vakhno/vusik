// zod
import * as z from "zod";

interface Props {
	t: (key: string) => string;
}

const SignUpSchema = ({ t }: Props) =>
	z
		.object({
			name: z
				.string()
				.min(1, { message: t("sign-up.schema-name-min") })
				.min(5, { message: t("sign-up.schema-name-short") }),
			email: z
				.string()
				.min(1, { message: t("sign-up.schema-email-min") })
				.email({ message: t("sign-up.schema-email-type") }),
			avatar: z
				.instanceof(File)
				.refine((file) =>
					["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/bmp", "image/tiff"].includes(
						file.type,
					),
				)
				.optional(),
			password: z.string().min(1, { message: t("sign-up.schema-password-min") }),
			confirmPassword: z.string().min(1, {
				message: t("sign-up.schema-confirm-password-min"),
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			path: ["confirmPassword"],
			message: t("sign-up.schema-passwords-match"),
		});

export default SignUpSchema;
