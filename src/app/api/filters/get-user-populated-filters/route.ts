import { mongoConnection } from "@/shared/lib/mongodb";
import FilterModel from "@/entities/filter/model/model";
import { FiltersPopulatedUserType } from "@/entities/filter/model/type/filtersPopulated";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
import { NextResponse } from "next/server";

type SuccessResponse = {
	success: true;
	filters: FiltersPopulatedUserType;
};

type ErrorResponse = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = convertURLSearchParamsToObject(URLSearchParams);
		const { id } = searchParams;
		const filters = await FilterModel.findOne().select(`users.${id}`).populate({
			path: "shelters.shelter",
			model: "Shelter",
		});

		return NextResponse.json({ success: true, filters: filters }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
