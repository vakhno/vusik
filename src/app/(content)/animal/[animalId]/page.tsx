"use server";

// screen
import Animal from "@/screens/animal";
// next tools
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-animal-by-id/route";
// shared
import { API_GET_ANIMAL_BY_ID } from "@/shared/constants/routes";

type Props = {
	params: { animalId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { animalId } = params;
	const locale = await getLocale();
	const t = await getTranslations({ locale });
	const animalUrlSearchParams = new URLSearchParams();

	animalUrlSearchParams.set("id", animalId);

	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_ANIMAL_BY_ID}/?${animalUrlSearchParams}`, { method: "GET" });
	const result = (await response.json()) as SuccessResponse | ErrorResponse;
	const { success } = result;

	if (success) {
		const {
			data: { animal },
		} = result;

		return {
			title: t("metadata.page.animal.title", { name: animal.name }),
			description: t("metadata.page.animal.description", { name: animal.shelterId.name }),
			openGraph: {
				title: t("metadata.page.animal.openGraph.title", { name: animal.name }),
				description: t("metadata.page.animal.openGraph.description", { name: animal.shelterId.name }),
				url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/animal/${animalId}`,
				siteName: t("general.site-name"),
				images: [
					{
						url: animal.mainPhoto || "",
						width: 1200,
						height: 630,
						alt: t("metadata.page.animal.openGraph.image.alt"),
						type: "image/jpeg",
					},
				],
			},
			twitter: {
				card: "summary_large_image",
				title: t("metadata.page.animal.twitter.title", { name: animal.name }),
				description: t("metadata.page.animal.twitter.description", { name: animal.shelterId.name }),
				images: animal.mainPhoto || "",
			},
		};
	} else {
		return {
			title: "",
			description: "",
		};
	}
}

const Page = ({ params }: Props) => {
	const { animalId } = params;

	return <Animal animalId={animalId} />;
};

export default Page;
