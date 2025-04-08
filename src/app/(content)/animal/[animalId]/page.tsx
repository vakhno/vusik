"use server";

// entities
import Animal from "@/entities/animal/ui/animalProfile";
// next tools
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
// mongoose
import { Types } from "mongoose";
// api
import { SuccessResponse as AnimalSuccessResponse, ErrorResponse as AnimalErrorResponse } from "@/app/api/animal/get-animal-by-id/route";
import { SuccessResponse as ShelterSuccessResponse, ErrorResponse as ShelterErrorResponse } from "@/app/api/shelter/get-shelter-by-id/route";

type Props = {
	params: { animalId: Types.ObjectId };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { animalId } = params;
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	let shelter = null;

	const animalUrlSearchParams = new URLSearchParams();
	animalUrlSearchParams.set("id", String(animalId));
	const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-animal-by-id/?${animalUrlSearchParams}`, {
		method: "GET",
	});

	const result = (await response.json()) as AnimalSuccessResponse | AnimalErrorResponse;
	const { success } = result;

	if (success) {
		const {
			data: { animal },
		} = result;

		if (animal) {
			const shelterUrlSearchParams = new URLSearchParams();
			shelterUrlSearchParams.set("id", String(animal.shelterId));
			const shelterResponse = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/shelter/get-shelter-by-id/?${shelterUrlSearchParams}`, {
				method: "GET",
			});

			const { ok: isShelterResponseOk } = shelterResponse;

			if (isShelterResponseOk) {
				const data = (await shelterResponse.json()) as ShelterSuccessResponse | ShelterErrorResponse;
				const { success } = data;

				if (success) {
					const { shelter: shelterData } = data;

					shelter = shelterData;
				}
			}
		}
		if (animal && shelter) {
			return {
				title: t("metadata.page.animal.title", { name: animal.name }),
				description: t("metadata.page.animal.description", { name: shelter.name }),
				openGraph: {
					title: t("metadata.page.animal.openGraph.title", { name: animal.name }),
					description: t("metadata.page.animal.openGraph.description", { name: shelter.name }),
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
					description: t("metadata.page.animal.twitter.description", { name: shelter.name }),
					images: animal.mainPhoto || "",
				},
			};
		} else {
			return {
				title: "",
				description: "",
			};
		}
	} else {
		return {
			title: "",
			description: "",
		};
	}
}

const Page = async ({ params }: Props) => {
	const { animalId } = params;

	return <Animal animalId={animalId} />;
};

export default Page;
