import SignUpPage from "@/views/sign-up";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	return {
		title: t("metadata.sign-up.title"),
		description: t("metadata.sign-up.description"),
		openGraph: {
			title: t("metadata.sign-up.title"),
			description: t("metadata.sign-up.description"),
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}`,
			siteName: t("general.site-name"),
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/sign-up/1200x630.jpg`,
					width: 1200,
					height: 630,
					alt: t("metadata.sign-up.openGraph.image.alt"),
					type: "image/jpeg",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("metadata.sign-up.twitter.title"),
			description: t("metadata.sign-up.twitter.description"),
			images: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/sign-up/twitter/1200x630.jpg`,
		},
	};
}

const page = () => {
	return <SignUpPage />;
};
export default page;
