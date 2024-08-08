"use client";
// UI components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// next-intl
import { useTranslations, useLocale } from "next-intl";
// actions
import localeChange from "@/actions/localeChange";
// constants
import { locales } from "@/constants/locale";
// types
import { Locale } from "@/types/locale";

const LocaleSwitcher = () => {
	const locale = useLocale();
	const t = useTranslations();
	const handleLanguageChange = async (language: Locale) => {
		await localeChange(language);
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
						<>
							<Button
								variant="link"
								disabled={localeItem === locale}
								key={localeItem}
								onClick={() => handleLanguageChange(localeItem)}
							>
								{t(`locales.${localeItem}`)}
							</Button>
							<Separator orientation="vertical" className="flex h-full" />
						</>
					);
				}
			})}
		</div>
	);
};

export default LocaleSwitcher;
