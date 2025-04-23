"use server";

// features
import Shelter from "@/features/shelter";
// next tools
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
// api
import { SuccessResponse as ShelterSuccessResponse, ErrorResponse as ShelterErrorResponse } from "@/app/api/shelter/get-shelter-by-id/route";

type Props = {
	params: { shelterId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { shelterId } = params;
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	let shelter = null;

	const shelterUrlSearchParams = new URLSearchParams();
	shelterUrlSearchParams.set("id", String(shelterId));
	const shelterResponse = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelter-by-id/?${shelterUrlSearchParams}`, {
		method: "GET",
	});

	const { ok: isShelterResponseOk } = shelterResponse;

	if (isShelterResponseOk) {
		const data = (await shelterResponse.json()) as ShelterSuccessResponse | ShelterErrorResponse;
		const { success } = data;

		if (success) {
			const {
				data: { shelter: shelterData },
			} = data;

			shelter = shelterData;
		}
	}

	if (shelter) {
		return {
			title: t("metadata.page.shelter.title", { name: shelter.name }),
			description: t("metadata.page.shelter.description", { name: shelter.name }),
			openGraph: {
				title: t("metadata.page.shelter.openGraph.title", { name: shelter.name }),
				description: t("metadata.page.shelter.openGraph.description", { name: shelter.name }),
				url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/shelter/${shelterId}`,
				siteName: t("general.site-name"),
				images: [
					{
						url: shelter.mainPhoto || "",
						width: 1200,
						height: 630,
						alt: t("metadata.page.shelter.openGraph.image.alt"),
						type: "image/jpeg",
					},
				],
			},
			twitter: {
				card: "summary_large_image",
				title: t("metadata.page.shelter.twitter.title", { name: shelter.name }),
				description: t("metadata.page.shelter.twitter.description", { name: shelter.name }),
				images: shelter.mainPhoto || "",
			},
		};
	} else {
		return {
			title: "",
			description: "",
		};
	}
}

const Page = async ({ params }: Props) => {
	const { shelterId } = params;

	return <Shelter shelterId={shelterId} />;
};

export default Page;
