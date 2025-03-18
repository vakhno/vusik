// next-intl
import { getRequestConfig } from "next-intl/server";
// actions
import { getLocale } from "@/shared/actions/locale/postNewLocale";

export default getRequestConfig(async () => {
	const locale = await getLocale();

	return {
		locale,
		messages: (await import(`./locales/${locale}.json`)).default,
	};
});
