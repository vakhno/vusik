"use server";

// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import ArticlesList from "@/features/article/loadAllArticles/ui/articlesList";
import ArticlesFiltersForm from "@/features/article/loadAllArticlesFilters/ui/articlesFiltersForm";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllArticles } from "@/features/article/loadAllArticles/model/query/fetchAllArticles";
import { queryPrefetchGetAllArticlesFilter } from "@/features/article/loadAllArticlesFilters/model/query/fetchAllArticlesFilters";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const [queryArticles, queryFilters] = await Promise.all([
		queryPrefetchGetAllArticles({ searchParams }),
		queryPrefetchGetAllArticlesFilter({ searchParams }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryArticles)}>
			<HydrationBoundary state={dehydrate(queryFilters)}>
				<ArticlesFiltersForm searchParams={searchParams} />
				<ArticlesList articleSearchParams={searchParams} />
			</HydrationBoundary>
		</HydrationBoundary>
	);
};

export default Index;
