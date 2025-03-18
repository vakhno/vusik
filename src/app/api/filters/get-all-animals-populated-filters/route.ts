import FilterModel from "@/entities/filter/model/model";
import { FiltersPopulatedAnimalsType } from "@/entities/filter/model/type/filtersPopulated";
import { mongoConnection } from "@/shared/lib/mongodb";
import { NextResponse } from "next/server";

type SuccessResponse = {
	success: true;
	filters: FiltersPopulatedAnimalsType;
};

type ErrorResponse = {
	success: false;
};

export type APIResponse = SuccessResponse | ErrorResponse;

export async function GET(): Promise<NextResponse<APIResponse>> {
	try {
		await mongoConnection();

		const filters = await FilterModel.findOne().select("animals").populate("animals.shelters");

		return NextResponse.json({ success: true, filters: filters.animals }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
