import { mongoConnection } from "@/shared/lib/mongodb";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	data: {
		shelter: ShelterType;
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
		const { id } = searchParams;
		const shelter = await ShelterModel.findById(id);

		if (shelter) {
			return NextResponse.json({ success: true, data: { shelter } }, { status: 200 });
		} else {
			return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
		}
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
