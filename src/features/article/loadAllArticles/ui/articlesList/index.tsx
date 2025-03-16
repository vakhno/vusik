"use client";

// features
import { queryGetAllArticles } from "@/features/article/loadAllArticles/model/query/fetchAllArticles";
import ArticlesList from "@/features/article/loadAllArticles/ui/articlesList/list";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// constants
import { articlesPerPage } from "@/shared/constants/counts";

type Props = { articleSearchParams: SearchParamsType };

const Index = ({ articleSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedArticles,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetAllArticles({ searchParams: articleSearchParams });

	const articles = fetchedArticles?.pages.flatMap((page) => page?.articles || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<ArticlesList
			articles={articles}
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
