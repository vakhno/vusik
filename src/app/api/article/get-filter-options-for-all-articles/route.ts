// import ArticleModel from "@/entities/article/model/model";
// import { ArticleSearchSchemaType } from "@/entities/article/model/type/articleSearch";
// import { NextResponse } from "next/server";
// import { validateArticleFilterKeysAndValues, comparingArticleFilterWithOptions } from "@/utils/filter";
// import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
// import { ArticleType } from "@/entities/article/model/type/article";

// export type SuccessResult = {
// 	success: true;
// 	availableOptions: Record<keyof ArticleSearchSchemaType, string[] | boolean[]>;
// 	selectedOptions: Record<keyof ArticleSearchSchemaType, string[] | boolean[]>;
// };

// export type ErrorResult = {
// 	success: false;
// };

// export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
// 	try {
// 		const { searchParams: URLSearchParams } = new URL(req.url);
// 		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
// 		const { id, ...filterParams } = searchParams;
// 		// need to validate article filter kyes and filter values types, becaue user can pass non-existing keys, so non-existing keys be removed
// 		const validatedArticleFilterKeysAndValues = validateArticleFilterKeysAndValues(filterParams);
// 		const availableCityOptions = await ArticleModel.distinct("category");

// 		const allOptions = {
// 			category: availableCityOptions,
// 		} as Record<keyof ArticleSearchSchemaType, string[]>;

// 		const selectedOptions = comparingArticleFilterWithOptions({
// 			options: allOptions,
// 			values: validatedArticleFilterKeysAndValues,
// 		});
// 		let articles = [];

// 		if (id && id[0]) {
// 			articles = await ArticleModel.find({ author: id[0] });
// 		} else {
// 			articles = await ArticleModel.find();
// 		}

// 		const availableOptions = {
// 			category: Array.from(new Set(articles.map((article: ArticleType) => article.category))),
// 		} as Record<keyof ArticleSearchSchemaType, string[] | boolean[]>;

// 		return NextResponse.json(
// 			{ success: true, availableOptions: availableOptions, selectedOptions: selectedOptions },
// 			{ status: 200 },
// 		);
// 	} catch (_) {
// 		return NextResponse.json({ success: false }, { status: 500 });
// 	}
// }

import { NextResponse } from "next/server";
import getAllArticlesFilters, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/article/loadAllArticlesFilters/api/getAllArticlesFilters";

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getAllArticlesFilters({ searchParams: URLSearchParams });
	return result;
}
