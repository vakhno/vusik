import { mongoConnection } from "@/lib/mongodb";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { NextResponse } from "next/server";

type SuccessResponse = {
	success: true;
	shelter: ShelterType;
};

type ErrorResponse = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id } = searchParams;
		const shelter = await ShelterModel.findById(id);

		return NextResponse.json({ success: true, shelter: shelter }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
