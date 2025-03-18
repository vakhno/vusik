// import { mongoConnection } from "@/lib/mongodb";
// import ArticleModel from "@/entities/article/model/model";
// import { ArticleType } from "@/entities/article/model/type/article";
// import { NextResponse } from "next/server";
// import { validateToNaturalNumber } from "@/utils/number";
// import { validateArticleFilterKeysAndValues } from "@/utils/filter";
// import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
// import { articlesPerPage } from "@/constants/counts";

// export type SuccessResult = {
// 	success: true;
// 	articles: ArticleType[];
// 	isHasMore: boolean;
// };

// export type ErrorResult = {
// 	success: false;
// };

// export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
// 	try {
// 		await mongoConnection();
// 		const { searchParams: URLSearchParams } = new URL(req.url);
// 		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
// 		const { page, ...filterParams } = searchParams;
// 		// need to validate to get natural number of the page
// 		const validatePage = validateToNaturalNumber(page[0]);
// 		// need to validate article filters, becaue user can pass non-existing keys, so non-existing keys be removed
// 		// but we dont check if values of the keys
// 		const validatedFilterParams = validateArticleFilterKeysAndValues(filterParams);

// 		let articles = [];
// 		let isHasMore = false;

// 		articles = await ArticleModel.find(validatedFilterParams)
// 			.skip((validatePage - 1) * articlesPerPage)
// 			.limit(articlesPerPage);
// 		const totalArticles = await ArticleModel.countDocuments(validatedFilterParams);

// 		isHasMore = validatePage * articlesPerPage < totalArticles;

// 		return NextResponse.json({ success: true, articles: articles, isHasMore: isHasMore }, { status: 200 });
// 	} catch (_) {
// 		return NextResponse.json({ success: false }, { status: 500 });
// 	}
// }

import { NextResponse } from "next/server";
import getAllArticles, { ErrorResponse, SuccessResponse } from "@/features/article/loadAllArticles/api/getAllArticles";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getAllArticles({ searchParams: URLSearchParams });
	return result;
}
