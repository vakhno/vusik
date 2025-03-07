// entities
import ArticleModel from "@/entities/article/model/model";
// next tools
import { NextResponse } from "next/server";
// features
import SelectedFiltersType from "@/features/article/loadProfileArticlesFilters/model/type/selectedFiltersType";
import AvailableFiltersType from "@/features/article/loadProfileArticlesFilters/model/type/availableFiltersType";
import ParsedSearchParamsType from "@/features/article/loadProfileArticlesFilters/model/type/parsedSearchParamsType";
// mongoose
import { Types } from "mongoose";

async function getAvailableArticleOptions(filters: ParsedSearchParamsType = {}): Promise<AvailableFiltersType> {
	const userId = filters.id ? new Types.ObjectId(filters.id) : null;
	const allCategories = await ArticleModel.distinct("category", userId ? { userId } : {});
	const articleQuery: { category?: { $in: string[] }; userId?: Types.ObjectId } = userId ? { userId } : {};

	if (filters.category?.length) articleQuery.category = { $in: filters.category };

	const category = allCategories;

	return {
		category,
	};
}

const parseAnimalUrlSearchParams = (urlSearchParams: URLSearchParams): ParsedSearchParamsType => {
	const query = {} as ParsedSearchParamsType;
	urlSearchParams.forEach((value, key) => {
		if (key === "category") {
			query[key] = Array.from(new Set(value.split(",")));
		} else if (key === "id") {
			query[key] = value;
		}
	});
	return query;
};

function validateAnimalSearchParams(
	searchParams: SelectedFiltersType,
	availableOptions: AvailableFiltersType,
): SelectedFiltersType {
	const validatedParams = {
		category: [],
	} as SelectedFiltersType;

	for (const key in searchParams) {
		if (key === "category") {
			if (searchParams[key]) {
				searchParams[key].forEach((category: string) => {
					if (availableOptions.category.includes(category)) {
						if (Array.isArray(validatedParams[key])) {
							validatedParams[key].push(category);
						} else {
							validatedParams[key] = [category];
						}
					}
				});
			}
		}
	}
	return validatedParams;
}

export type SuccessResponse = {
	success: true;
	availableOptions: AvailableFiltersType;
	selectedOptions: SelectedFiltersType;
};

export type ErrorResponse = {
	success: false;
};

type Props = {
	searchParams: URLSearchParams;
};

const Index = async ({ searchParams }: Props): Promise<NextResponse<SuccessResponse | ErrorResponse>> => {
	try {
		const parsedSearchParams = parseAnimalUrlSearchParams(searchParams);
		const availableOptions = await getAvailableArticleOptions(parsedSearchParams);
		const selectedOptions = validateAnimalSearchParams(parsedSearchParams, availableOptions);

		return NextResponse.json({ success: true, availableOptions, selectedOptions }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
};

export default Index;
