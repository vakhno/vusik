"use client";

// entities
import { ArticleType } from "@/entities/article/model/type/article";
import ArticleCard from "@/entities/article/ui/articleCard";
import ArticleCardSkeleton from "@/entities/article/ui/articleCard/articleCardSkeleton";
// shared
import { Button } from "@/shared/ui/button";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	isEditable?: boolean;
	isLoading: boolean;
	isPending: boolean;
	isFetchingNextPage: boolean;
	isHasNextPage: boolean;
	articles: ArticleType[];
	countPerPage: number;
	onNewPageUpload: () => void;
};

const Index = ({
	isEditable = false,
	isLoading,
	isPending,
	isFetchingNextPage,
	isHasNextPage,
	articles,
	countPerPage,
	onNewPageUpload,
}: Props) => {
	const t = useTranslations();
	const handleNewPageUpload = () => {
		onNewPageUpload();
	};

	return (
		<div>
			{!isLoading ? (
				<div className="flex justify-center">
					{articles && articles.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
								{articles.map((article: ArticleType) => {
									return (
										<ArticleCard
											isEditable={isEditable}
											key={article._id.toString()}
											article={article}
										/>
									);
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: countPerPage }, (_, index) => (
											<ArticleCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{isHasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => handleNewPageUpload()}>{t("page.animals.load-more")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("page.animals.no-animals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
					{Array.from({ length: countPerPage }, (_, index) => (
						<ArticleCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
