// libs
import { mongoConnection } from "@/lib/mongodb";
// entities
import ArticleModel from "@/entities/article/model/model";
import { ArticleType } from "@/entities/article/model/type/article";
// next tools
import { NextResponse } from "next/server";
// utils
import { validateToNaturalNumber } from "@/utils/number";
// constants
import { articlesPerPage } from "@/constants/counts";

export type SuccessResponse = {
	success: true;
	articles: ArticleType[];
	isHasMore: boolean;
};

export type ErrorResponse = {
	success: false;
};

type parsedArticleSearchParamsType = {
	category?: string[];
	page?: number;
	id?: string;
};

const parseShelterUrlSearchParams = (urlSearchParams: URLSearchParams): parsedArticleSearchParamsType => {
	const query = {} as parsedArticleSearchParamsType;

	urlSearchParams.forEach((value, key) => {
		if (key === "id") {
			query[key] = value;
		} else if (key === "page") {
			query[key] = validateToNaturalNumber(value);
		} else if (key === "category") {
			query[key] = Array.from(new Set(value.split(",")));
		}
	});

	return query;
};

type Props = {
	searchParams: URLSearchParams;
};

const Index = async ({ searchParams }: Props): Promise<NextResponse<SuccessResponse | ErrorResponse>> => {
	try {
		await mongoConnection();

		const parsedParams = parseShelterUrlSearchParams(searchParams);
		const { page = 1, id, ...filterParams } = parsedParams;
		const validatedFilters = filterParams;

		let articles = [];

		articles = await ArticleModel.find({ ...validatedFilters, userId: id })
			.skip((page - 1) * articlesPerPage)
			.limit(articlesPerPage);

		const totalShelters = await ArticleModel.countDocuments({ ...validatedFilters, userId: id });
		const isHasMore = page * articlesPerPage < totalShelters;

		return NextResponse.json({ success: true, articles: articles, isHasMore: isHasMore }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
};

export default Index;
