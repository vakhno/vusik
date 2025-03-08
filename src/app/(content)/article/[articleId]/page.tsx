// features
import Article from "@/features/article";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// entities
import { queryPrefetchArticle } from "@/entities/article/model/query/queryById";
// mongoose
import { Types } from "mongoose";

type Props = {
	params: { articleId: Types.ObjectId };
};

const Page = async ({ params }: Props) => {
	const { articleId } = params;

	if (articleId) {
		// to prefetch articles on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryArticle = await queryPrefetchArticle({ articleId: articleId });

		return (
			<HydrationBoundary state={dehydrate(queryArticle)}>
				<div className="w-full">
					<Article articleId={articleId} />
				</div>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Page;
