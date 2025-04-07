// shared
import { mongoConnection } from "@/shared/lib/mongodb";
import { sheltersPerPage } from "@/shared/constants/counts";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
// entities
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// next tools
import { NextResponse } from "next/server";

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
		const parsedParams = convertURLSearchParamsToObject(searchParams);
		const { page = 1, ...filterParams } = parsedParams;
		const validatedFilters = filterParams;
		const shelters = await ShelterModel.find(filterParams)
			.skip((Number(page) - 1) * sheltersPerPage)
			.limit(sheltersPerPage);
		const totalShelters = await ShelterModel.countDocuments(validatedFilters);
		const isHasMore = Number(page) * sheltersPerPage < totalShelters;

		return NextResponse.json({ success: true, data: { shelters, isHasMore } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
