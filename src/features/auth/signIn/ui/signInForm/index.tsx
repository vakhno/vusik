"use client";

// next tools
import { useRouter } from "next/navigation";
// next-intl
import { useTranslations } from "next-intl";
// shared
import useUserStore from "@/shared/zustand/store/user.store";
import { cn } from "@/shared/lib/utils";
import { HOME_ROUTE } from "@/shared/constants/routes";
// sonner
import { toast } from "sonner";
// features
import SignInFields from "@/features/auth/signIn/ui/signInForm/fields";
import SignInSchemaType from "@/features/auth/signIn/model/type/signInFormSchema";
import { mutation_signIn } from "@/features/auth/signIn/model/query/signIn";

type Props = {
	className?: string;
};

const Index = ({ className = "" }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const { mutateAsync: signIn } = mutation_signIn({
		onSuccess: (user) => {
			setUser(user);

			router.push(HOME_ROUTE);
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
