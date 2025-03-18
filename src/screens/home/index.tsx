"use server";

// shared
import LinkCard from "@/shared/shared/LinkCard";
// next-intl
import { useTranslations } from "next-intl";

const Index = () => {
	const t = useTranslations();

	return (
		<div className="mb-4 flex min-h-[400px] w-full gap-4 max-md:min-h-[600px] max-md:flex-col">
			<LinkCard
				className="max-md:min-h-[300px]"
				href="/"
				title={t("page.home.main-card.title")}
				buttonTitle={t("page.home.main-card.button-title")}
			/>
			<div className="flex flex-1 flex-col gap-4 max-md:flex-col">
				<LinkCard
					href="/shelters"
					title={t("page.home.secondary-card-1.title")}
					buttonTitle={t("page.home.secondary-card-1.button-title")}
				/>
				<LinkCard
					href="/animals"
					title={t("page.home.secondary-card-2.title")}
					buttonTitle={t("page.home.secondary-card-2.button-title")}
				/>
			</div>
		</div>
	);
};

export default Index;
