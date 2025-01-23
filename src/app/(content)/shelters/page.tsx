// pages
import SheltersPage from "@/views/shelters";
// next tools
import { Metadata } from "next";
// next-intl
import { getLocale, getTranslations } from "next-intl/server";
// types
import { SearchParamsType } from "@/types/searchParams.type";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllShelters } from "@/entities/shelter/model/query/sheltersAllByPage";
import { queryPrefetchGetAllSheltersFilter } from "@/entities/shelter/model/query/sheltersAllByPageFilters";

type Props = {
	searchParams: SearchParamsType;
};

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	return {
		title: t("metadata.home.title"),
		description: t("metadata.home.description"),
		openGraph: {
			title: t("metadata.home.openGraph.title"),
			description: t("metadata.home.description"),
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}`,
			siteName: t("general.site-name"),
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/home/1200x630.jpg`,
					width: 1200,
					height: 630,
					alt: t("metadata.home.openGraph.image.alt"),
					type: "image/jpeg",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: t("metadata.home.twitter.title"),
			description: t("metadata.home.twitter.description"),
			images: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/home/twitter/1200x630.jpg`,
		},
	};
}

const Page = async ({ searchParams }: Props) => {
	const [queryShelters, queryOptions] = await Promise.all([
		// to prefetch shelters on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		queryPrefetchGetAllShelters({ searchParams: searchParams }),
		// queryPrefetchGetAllSheltersFilter - to prefetch shelters filter options with passed searchParams
		queryPrefetchGetAllSheltersFilter({ searchParams: searchParams }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryShelters)}>
			<HydrationBoundary state={dehydrate(queryOptions)}>
				<SheltersPage searchParams={searchParams} />
			</HydrationBoundary>
		</HydrationBoundary>
	);
};

export default Page;
