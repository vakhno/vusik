"use client";

// features
import { queryGetProfileArticles } from "@/features/article/loadProfileArticles/model/query/fetchProfileArticles";
import ArticlesList from "@/features/article/loadProfileArticles/ui/articlesList/list";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// mongoose
import { Types } from "mongoose";
// constants
import { articlesPerPage } from "@/constants/counts";

type Props = { isEditable?: boolean; id: Types.ObjectId; articleSearchParams: SearchParamsType };

const Index = ({ isEditable = false, id, articleSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedArticles,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetProfileArticles({ id, searchParams: articleSearchParams });

	const articles = fetchedArticles?.pages.flatMap((page) => page?.articles || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<ArticlesList
			articles={articles}
			isEditable={isEditable}
			isLoading={isLoading}
			isPending={isPending}
			isFetchingNextPage={isFetchingNextPage}
			isHasNextPage={hasNextPage}
			countPerPage={articlesPerPage}
			onNewPageUpload={handleNewPageUpload}
		/>
	);
};

export default Index;
