"use client";

// shared
import { Button } from "@/shared/ui/button";
// next-intl
import { useTranslations } from "next-intl";

const Index = () => {
	const t = useTranslations();

	const onHandleClick = () => {};

	return <Button onClick={onHandleClick}>{t("delete")}</Button>;
};

export default Index;
