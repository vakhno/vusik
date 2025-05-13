"use client";

import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode } from "react";
import { defaultLocale } from "@/shared/constants/locale";

const libraries: Libraries = ["places", "drawing", "geometry"];

const Index = ({ children }: { children: ReactNode }) => {
	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
		libraries,
		language: defaultLocale,
	});

	if (loadError) return <p>Encountered error while loading Google Maps</p>;

	if (!isLoaded) return <p>Map Script is loading ...</p>;

	return <>{children}</>;
};

export default Index;
