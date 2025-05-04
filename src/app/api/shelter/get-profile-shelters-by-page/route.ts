// libs
import { mongoConnection } from "@/shared/lib/mongodb";
// entities
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// next tools
import { NextResponse } from "next/server";
// utils
import { validateToNaturalNumber } from "@/shared/utils/number";
// constants
import { SHELTERS_PER_PAGE } from "@/shared/constants/counts";

type parsedShelterSearchParamsType = {
	state?: string[];
	city?: string[];
	page?: number;
	id?: string;
};

const parseAnimalUrlSearchParams = (urlSearchParams: URLSearchParams): parsedShelterSearchParamsType => {
	const query = {} as parsedShelterSearchParamsType;

	urlSearchParams.forEach((value, key) => {
		if (key === "id") {
			query[key] = value;
		} else if (key === "page") {
			query[key] = validateToNaturalNumber(value);
		} else if (key === "state" || key === "city") {
			query[key] = Array.from(new Set(value.split(",")));
		}
	});

	return query;
};

export type SuccessResponse = {
	success: true;
	data: {
		shelters: ShelterType[];
		isHasMore: boolean;
	};
};

export type ErrorResponse = {
	success: false;
	error: {
		message: string;
		code: number;
	};
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams } = new URL(req.url);
		const parsedParams = parseAnimalUrlSearchParams(searchParams);
		const { page = 1, id, ...filterParams } = parsedParams;
		const validatedFilters = filterParams;

		let shelters = [];
		let isHasMore = false;

		shelters = await ShelterModel.find({ ...validatedFilters, userId: id })
			.skip((page - 1) * SHELTERS_PER_PAGE)
			.limit(SHELTERS_PER_PAGE);
		const totalShelters = await ShelterModel.countDocuments({ ...validatedFilters, userId: id });
		isHasMore = page * SHELTERS_PER_PAGE < totalShelters;

		return NextResponse.json({ success: true, data: { shelters, isHasMore } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
