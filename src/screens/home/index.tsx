"use server";

// shared
import LinkCard from "@/shared/shared/LinkCard";
import { HOME_ROUTE, SHELTERS_ROUTE, ANIMALS_ROUTE } from "@/shared/constants/routes";
// next-intl
import { useTranslations } from "next-intl";

const Index = () => {
	const t = useTranslations();

	return (
		<div className="mb-4 flex min-h-[400px] w-full gap-4 max-md:min-h-[600px] max-md:flex-col">
			<LinkCard className="max-md:min-h-[300px]" href={HOME_ROUTE} title={t("page.home.main-card.title")} buttonTitle={t("page.home.main-card.button-title")} />
			<div className="flex flex-1 flex-col gap-4 max-md:flex-col">
				<LinkCard href={SHELTERS_ROUTE} title={t("page.home.secondary-card-1.title")} buttonTitle={t("page.home.secondary-card-1.button-title")} />
				<LinkCard href={ANIMALS_ROUTE} title={t("page.home.secondary-card-2.title")} buttonTitle={t("page.home.secondary-card-2.button-title")} />
			</div>
		</div>
	);
};

export default Index;
