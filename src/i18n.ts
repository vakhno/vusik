// next-intl
import { getRequestConfig } from "next-intl/server";
// next tools
import { cookies } from "next/headers";
// constants
import { VUSIK_LOCALE_COOKIE_KEY, defaultLocale, locales } from "@/constants/locale";

const localeCookieName = VUSIK_LOCALE_COOKIE_KEY;

export default getRequestConfig(async () => {
	const cookie = cookies();
	const localeCookie = cookie.get(localeCookieName)?.value as (typeof locales)[number];
	const locale = localeCookie && locales.includes(localeCookie) ? localeCookie : defaultLocale;

	return {
		locale,
		messages: (await import(`./locales/${locale}.json`)).default,
	};
});
