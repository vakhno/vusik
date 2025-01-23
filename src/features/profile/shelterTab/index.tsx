"use client";
// react
import { useState } from "react";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import SheltersProfileSearchForm from "@/features/shelter/searchProfileShelter/ui/searchProfileShelterForm";
import LoadMoreProfileSheltersList from "@/features/shelter/loadMoreProfileShelters/ui/loadMoreProfileSheltersList";
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
	const [shelterSearchParams, setShelterSearchParams] = useState<SearchParamsType>(searchParams || {});

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
			{isEditable ? (
				<Link href="/profile/myprofile/new-shelter" className={`${buttonVariants()} my-8 w-full`}>
					Add new Shelter
				</Link>
			) : null}
			<SheltersProfileSearchForm
				userId={userId}
				className="mb-8"
				searchParams={shelterSearchParams}
				filterChage={handleFitlerChange}
			/>
			<LoadMoreProfileSheltersList
				shelterSearchParams={shelterSearchParams}
				userId={userId}
				isEditable={isEditable}
			/>
		</div>
	);
};

export default Index;
