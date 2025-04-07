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
import SignUpFields from "@/features/auth/signUp/ui/signUpForm/fields";
import SignUpSchemaType from "@/features/auth/signUp/model/type/signUpFormSchema";
import { mutation_signUp } from "@/features/auth/signUp/model/query/signUp";

type Props = {
	className?: string;
};

const Index = ({ className = "" }: Props) => {
	const t = useTranslations();
	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const { mutateAsync: signUp } = mutation_signUp({
		onSuccess: (user) => {
			setUser(user);

			router.push(HOME_ROUTE);
		},
		onError: (error) => {
			toast.error(t("page.auth.sign-up.error-toast-title"), {
				description: error,
			});
		},
	});

	const onHandleFormSubmit = async (fields: SignUpSchemaType) => {
		signUp(fields);
	};

	return (
		<div className={cn(className)}>
			<SignUpFields onFormSubmit={onHandleFormSubmit} />
		</div>
	);
};

export default Index;
