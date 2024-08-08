import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
	];
}
