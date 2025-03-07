import { mongoConnection } from "@/lib/mongodb";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { NextResponse } from "next/server";
import { validateShelterFilterKeysAndValues } from "@/utils/filter";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";

export type SuccessResult = {
	success: true;
	shelters: ShelterType[];
};

export type ErrorResult = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
	try {
		await mongoConnection();
		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id, ...filterParams } = searchParams;
		const idParam = id[0];
		// need to validate shelter filters, becaue user can pass non-existing keys, so non-existing keys be removed
		// but we dont check if values of the keys
		const validatedFilterParams = validateShelterFilterKeysAndValues(filterParams);

		let shelters = [];

		shelters = await ShelterModel.find({ ...validatedFilterParams, userId: idParam });

		return NextResponse.json({ success: true, shelters: shelters }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
