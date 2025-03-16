import FilterModel from "@/entities/filter/model/model";
import { FiltersPopulatedArticlesType } from "@/entities/filter/model/type/filtersPopulated";
import { mongoConnection } from "@/shared/lib/mongodb";
import { NextResponse } from "next/server";

type SuccessResponse = {
	success: true;
	filters: FiltersPopulatedArticlesType;
};

type ErrorResponse = {
	success: false;
};

export async function GET(): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const filters = await FilterModel.findOne().select("articles");

		return NextResponse.json({ success: true, filters: filters }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
