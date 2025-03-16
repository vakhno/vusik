import { locales } from "@/shared/constants/locale";

export type Locale = (typeof locales)[number];
export type Locales = keyof typeof locales;

export type LocaleType = {
	_id: string;
	code: string;
	createdAt: Date;
	updatedAt: Date;
};
