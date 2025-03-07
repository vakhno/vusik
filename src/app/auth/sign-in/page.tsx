import SignInPage from "@/views/sign-in";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	return {
		title: t("metadata.page.sign-in.title"),
		description: t("metadata.page.sign-in.description"),
		openGraph: {
			title: t("metadata.page.sign-in.title"),
			description: t("metadata.page.sign-in.description"),
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}`,
			siteName: t("general.site-name"),
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/sign-in/1200x630.jpg`,
					width: 1200,
					height: 630,
					alt: t("metadata.page.sign-in.openGraph.image.alt"),
					type: "image/jpeg",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("metadata.page.sign-in.twitter.title"),
			description: t("metadata.page.sign-in.twitter.description"),
			images: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/sign-in/twitter/1200x630.jpg`,
		},
	};
}

const page = () => {
	return <SignInPage />;
};
export default page;
