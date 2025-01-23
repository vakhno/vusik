"use client";
// react
import { useState } from "react";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import SearchAnimalForm from "@/features/animal/searchAnimal/ui/searchAnimalForm";
import LoadMoreAnimalsList from "@/features/animal/loadMoreAnimals/ui/loadMoreAnimalsList";
// utils
import { windowHistoryPush } from "@/utils/window";

type Props = {
	searchParams: SearchParamsType;
};

const Index = ({ searchParams }: Props) => {
	const [animalSearchParams, setAnimalSearchParams] = useState<SearchParamsType>(searchParams);

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
		setAnimalSearchParams(values);
	};

	return (
		<>
			<SearchAnimalForm className="mb-8" searchParams={animalSearchParams} filterChage={handleFitlerChange} />
			<LoadMoreAnimalsList animalSearchParams={animalSearchParams} />
		</>
	);
};

export default Index;
