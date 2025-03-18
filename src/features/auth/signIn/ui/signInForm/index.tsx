"use client";

// shared
import { toast } from "sonner";
// next tools
import { useRouter } from "next/navigation";
// shared
import useUserStore from "@/shared/zustand/store/user.store";
// next-intl
import { useTranslations } from "next-intl";
// features
import SignInFields from "@/features/auth/signIn/ui/signInForm/signInFields";
import SignInSchemaType from "@/features/auth/signIn/model/type/signInFormSchema";
import { querySignIn } from "@/features/auth/signIn/model/query/signIn";
import { cn } from "@/shared/lib/utils";

type Props = {
	className?: string;
};

const Index = ({ className = "" }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const { mutateAsync: signIn } = querySignIn({
		onSuccess: (user) => {
			setUser(user);
			router.push("/");
		},
		onError: (error) => {
			toast.error(t("page.auth.sign-in.error-toast-title"), {
				description: error,
			});
		},
	});

	const onHandleFormSubmit = async (fields: SignInSchemaType) => {
		signIn(fields);
	};

	return (
		<div className={cn(className)}>
			<SignInFields onFormSubmit={onHandleFormSubmit} />
		</div>
	);
};

export default Index;
