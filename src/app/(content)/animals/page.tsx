"use server";

// pages
import AnimalsPage from "@/views/animals";
// next tools
import { Metadata } from "next";
// next-intl
import { getLocale, getTranslations } from "next-intl/server";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	return {
		title: t("metadata.page.home.title"),
		description: t("metadata.page.home.description"),
		openGraph: {
			title: t("metadata.page.home.openGraph.title"),
			description: t("metadata.page.home.description"),
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}`,
			siteName: t("general.site-name"),
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/home/1200x630.jpg`,
					width: 1200,
					height: 630,
					alt: t("metadata.page.home.openGraph.image.alt"),
					type: "image/jpeg",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("metadata.page.home.twitter.title"),
			description: t("metadata.page.home.twitter.description"),
			images: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/home/twitter/1200x630.jpg`,
		},
	};
}

const Page = ({ searchParams }: Props) => {
	return <AnimalsPage searchParams={searchParams} />;
};

export default Page;
