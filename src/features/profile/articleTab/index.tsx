"use client";
// react
import { useState } from "react";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import ArticlesProfileSearchForm from "@/features/article/searchProfileArticle/ui/searchProfileArticleForm";
import LoadMoreProfileArticlesList from "@/features/article/loadMoreProfileArticles/ui/loadMoreProfileArticlesList";
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
				<Link href="/profile/myprofile/new-article" className={`${buttonVariants()} my-8 w-full`}>
					Add new article
				</Link>
			) : null}
			<ArticlesProfileSearchForm
				userId={userId}
				className="mb-8"
				searchParams={articleSearchParams}
				filterChage={handleFitlerChange}
			/>
			<LoadMoreProfileArticlesList articleSearchParams={articleSearchParams} userId={userId} />
		</div>
	);
};

export default Index;
