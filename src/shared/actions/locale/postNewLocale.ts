"use server";

import { cookies } from "next/headers";
import { Locale } from "@/shared/types/locale.type";
import { VUSIK_LOCALE_COOKIE_KEY, defaultLocale } from "@/shared/constants/locale";

export const getLocale = async () => {
	return cookies().get(VUSIK_LOCALE_COOKIE_KEY)?.value || defaultLocale;
};

export const postNewLocale = async (locale: Locale) => {
	cookies().set(VUSIK_LOCALE_COOKIE_KEY, locale);
};
