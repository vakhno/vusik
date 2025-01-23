"use client";
// react
import { useState } from "react";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import SearchProfileAnimalForm from "@/features/animal/searchProfileAnimal/ui/searchProfileAnimalForm";
import LoadMoreProfileAnimalsList from "@/features/animal/loadMoreProfileAnimals/ui/loadMoreProfileAnimalsList";
// utils
import { windowHistoryPush } from "@/utils/window";
import { Types } from "mongoose";
import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";

type Props = {
	isEditable?: boolean;
	searchParams?: SearchParamsType;
	userId: Types.ObjectId;
};

const Index = ({ isEditable, searchParams, userId }: Props) => {
	const [articleSearchParams, setArticleSearchParams] = useState<SearchParamsType>(searchParams || {});

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
		setArticleSearchParams(values);
	};

	return (
		<div className="w-full">
			{isEditable ? (
				<Link href="/profile/myprofile/new-animal" className={`${buttonVariants()} my-8 w-full`}>
					Add new animal
				</Link>
			) : null}
			<SearchProfileAnimalForm
				userId={userId}
				className="mb-8"
				searchParams={articleSearchParams}
				filterChage={handleFitlerChange}
			/>
			<LoadMoreProfileAnimalsList
				animalSearchParams={articleSearchParams}
				userId={userId}
				isEditable={isEditable}
			/>
		</div>
	);
};

export default Index;
