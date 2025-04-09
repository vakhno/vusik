"use client";

// features
import { queryGetProfileArticles } from "@/features/article/loadProfileArticles/model/query/fetchProfileArticles";
import ArticlesList from "@/features/article/loadProfileArticles/ui/articlesList/list";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// constants
import { articlesPerPage } from "@/shared/constants/counts";

type Props = { isEditable?: boolean; id: string; articleSearchParams: SearchParamsType };

const Index = ({ isEditable = false, id, articleSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedArticles,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetProfileArticles({ userId: id, searchParams: articleSearchParams });

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
