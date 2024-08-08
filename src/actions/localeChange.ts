"use server";
import { cookies } from "next/headers";
import { Locale } from "@/types/locale";
import { VUSIK_LOCALE_COOKIE_KEY } from "@/constants/locale";

const localeChange = (locale: Locale) => {
	cookies().set(VUSIK_LOCALE_COOKIE_KEY, locale);
};

export default localeChange;
