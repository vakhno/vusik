import { MetadataRoute } from "next";
import {
	HOME_ROUTE,
	ANIMALS_ROUTE,
	SHELTERS_ROUTE,
	PROFILE_ROUTE,
	MY_PROFILE_ROUTE,
	ANIMAL_ROUTE,
	SHELTER_ROUTE,
	TERM_OF_USE_ROUTE,
	PRIVACY_POLICY_ROUTE,
	SIGN_IN_ROUTE,
	SIGN_UP_ROUTE,
} from "@/shared/constants/routes";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${HOME_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${ANIMALS_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${SHELTERS_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${PROFILE_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${MY_PROFILE_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${ANIMAL_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${SHELTER_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${TERM_OF_USE_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "never",
			priority: 0.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${PRIVACY_POLICY_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "never",
			priority: 0.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${SIGN_IN_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "never",
			priority: 0.0,
		},
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${SIGN_UP_ROUTE}`,
			lastModified: new Date(),
			changeFrequency: "never",
			priority: 0.0,
		},
	];
}
