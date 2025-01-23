"use client";
// react
import { useState } from "react";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import ArticlesSearchForm from "@/features/article/searchArticle/ui/searchArticleForm";
import LoadMoreArticlesList from "@/features/article/loadMoreArticles/ui/loadMoreArticlesList";
// utils
import { windowHistoryPush } from "@/utils/window";

type Props = {
	searchParams: SearchParamsType;
};

const Index = ({ searchParams }: Props) => {
	const [articleSearchParams, setArticleSearchParams] = useState<SearchParamsType>(searchParams);

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
			<ArticlesSearchForm className="mb-8" searchParams={articleSearchParams} filterChage={handleFitlerChange} />
			<LoadMoreArticlesList articleSearchParams={articleSearchParams} />
		</div>
	);
};

export default Index;
