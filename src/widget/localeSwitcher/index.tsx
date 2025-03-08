"use client";
// UI components
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
// next-intl
import { useTranslations, useLocale } from "next-intl";
// actions
import { postNewLocale } from "@/actions/locale/postNewLocale";
// constants
import { locales } from "@/constants/locale";
// types
import { Locale } from "@/types/locale.type";

const LocaleSwitcher = () => {
	const locale = useLocale();
	const t = useTranslations();
	const handleLanguageChange = async (language: Locale) => {
		await postNewLocale(language);
	};

	return (
		<div className="flex h-10">
			{locales.map((localeItem, index) => {
				if (index === locales.length - 1) {
					return (
						<Button
							variant="link"
							disabled={localeItem === locale}
							key={localeItem}
							onClick={() => handleLanguageChange(localeItem)}
						>
							{t(`locales.${localeItem}`)}
						</Button>
					);
				} else {
					return (
						<div key={localeItem} className="flex">
							<Button
								variant="link"
								disabled={localeItem === locale}
								onClick={() => handleLanguageChange(localeItem)}
							>
								{t(`locales.${localeItem}`)}
							</Button>
							<Separator orientation="vertical" className="flex h-full" />
						</div>
					);
				}
			})}
		</div>
	);
};

export default LocaleSwitcher;
