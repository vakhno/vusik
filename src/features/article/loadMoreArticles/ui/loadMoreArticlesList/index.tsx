import AnimalCardSkeleton from "@/shared/skeleton/animalCardSkeleton";
import { Button } from "@/shared/ui/button";
import ArticleCard from "@/entities/article/ui/articleCard";
import { cn } from "@/lib/utils";
import { queryGetAllArticles } from "@/entities/article/model/query/articlesAllByPage";
import { ArticleType } from "@/entities/article/model/type";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { SearchParamsType } from "@/types/searchParams.type";
import { articlesPerPage } from "@/constants/counts";

type Props = { className?: string; articleSearchParams: SearchParamsType };

const Index = ({ className, articleSearchParams }: Props) => {
	const t = useTranslations();
	// query to get articles
	const [articles, setArticles] = useState<ArticleType[]>([]);

	const {
		fetchNextPage,
		data: fetchedArticles,
		isLoading: isArticlesLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetAllArticles({ searchParams: articleSearchParams });

	// list of articles memoizations
	useMemo(() => {
		const initialArticles = fetchedArticles?.pages.map((pages) => pages?.articles || []).flat() ?? [];

		setArticles(initialArticles);
	}, [fetchedArticles]);

	return (
		<div className={cn(className)}>
			{!isArticlesLoading ? (
				<div className="flex justify-center">
					{articles && articles.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-2 gap-4">
								{articles.map((article: ArticleType) => {
									return (
										<ArticleCard
											isEditable={false}
											key={article._id.toString()}
											article={article}
										/>
									);
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: articlesPerPage }, (_, index) => (
											<AnimalCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{hasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => fetchNextPage()}>{t("loadMore")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("noAnimals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
					{Array.from({ length: articlesPerPage }, (_, index) => (
						<AnimalCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
