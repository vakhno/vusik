"use client";
// react
import { useState } from "react";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import SheltersSearchForm from "@/features/shelter/searchShelter/ui/searchShelterForm";
import LoadMoreSheltersList from "@/features/shelter/loadMoreShelters/ui/loadMoreSheltersList";
// utils
import { windowHistoryPush } from "@/utils/window";

type Props = {
	searchParams: SearchParamsType;
};

const Index = ({ searchParams }: Props) => {
	const [shelterSearchParams, setShelterSearchParams] = useState<SearchParamsType>(searchParams);

	const handleFitlerChange = (values: SearchParamsType) => {
		const urlSearchParams = new URLSearchParams();
		Object.entries(values).forEach(([key, value]) => {
			if (value) {
				if (Array.isArray(value)) {
					value.forEach((v) => urlSearchParams.append(key, String(v)));
				} else {
					urlSearchParams.set(key, String(value));
				}
			}
		});
		windowHistoryPush(urlSearchParams);
		setShelterSearchParams(values);
	};

	return (
		<div className="w-full">
			<SheltersSearchForm className="mb-8" searchParams={shelterSearchParams} filterChage={handleFitlerChange} />
			<LoadMoreSheltersList shelterSearchParams={shelterSearchParams} />
		</div>
	);
};

export default Index;
