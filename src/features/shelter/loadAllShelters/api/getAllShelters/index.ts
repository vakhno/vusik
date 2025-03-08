// libs
import { mongoConnection } from "@/lib/mongodb";
// entities
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// next tools
import { NextResponse } from "next/server";
// utils
import { validateToNaturalNumber } from "@/utils/number";
// constants
import { sheltersPerPage } from "@/constants/counts";

export type SuccessResponse = {
	success: true;
	shelters: ShelterType[];
	isHasMore: boolean;
};

export type ErrorResponse = {
	success: false;
};

type parsedShelterSearchParamsType = {
	state?: string[];
	city?: string[];
	page?: number;
};

const parseShelterUrlSearchParams = (urlSearchParams: URLSearchParams): parsedShelterSearchParamsType => {
	const query = {} as parsedShelterSearchParamsType;

	urlSearchParams.forEach((value, key) => {
		if (key === "page") {
			query[key] = parseInt(value, 10);
		} else if (key === "state" || key === "city") {
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
		const { page = 1, ...filterParams } = parsedParams;
		const validatedPage = validateToNaturalNumber(page) || 1;
		const validatedFilters = filterParams;
		const shelters = await ShelterModel.find(validatedFilters)
			.skip((validatedPage - 1) * sheltersPerPage)
			.limit(sheltersPerPage);

		const totalShelters = await ShelterModel.countDocuments(validatedFilters);
		const isHasMore = validatedPage * sheltersPerPage < totalShelters;

		return NextResponse.json({ success: true, shelters: shelters, isHasMore: isHasMore }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
};

export default Index;
