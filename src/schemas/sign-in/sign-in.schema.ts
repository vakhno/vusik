// zod
import * as z from "zod";

interface Props {
	t: (key: string) => string;
}

const SignInSchema = ({ t }: Props) =>
	z.object({
		email: z
			.string()
			.min(1, { message: t ? t("sign-in.schema-email-min") : "" })
			.email({ message: t ? t("sign-in.schema-email-type") : "" }),
		password: z.string().min(1, { message: t ? t("sign-in.schema-password-min") : "" }),
	});
export default SignInSchema;
