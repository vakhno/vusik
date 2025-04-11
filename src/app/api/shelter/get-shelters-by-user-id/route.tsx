import { mongoConnection } from "@/shared/lib/mongodb";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { NextResponse } from "next/server";
import { validateShelterFilterKeysAndValues } from "@/shared/utils/filter";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";

export type SuccessResponse = {
	success: true;
	data: {
		shelters: ShelterType[];
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
		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = convertURLSearchParamsToObject(URLSearchParams);
		const { id, ...filterParams } = searchParams;
		const idParam = id[0];
		// need to validate shelter filters, becaue user can pass non-existing keys, so non-existing keys be removed
		// but we dont check if values of the keys
		const validatedFilterParams = validateShelterFilterKeysAndValues(filterParams);

		let shelters = [];

		shelters = await ShelterModel.find({ ...validatedFilterParams, userId: idParam });

		return NextResponse.json({ success: true, data: { shelters: shelters } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
