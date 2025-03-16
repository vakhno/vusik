import { mongoConnection } from "@/shared/lib/mongodb";
import AnimalModel from "@/entities/animal/model/model";
import { AnimalType } from "@/entities/animal/model/type/animal";
import { gettingValuesFromURLSearchParams } from "@/shared/utils/URLSearchParams";
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	animal: AnimalType;
};

export type ErrorResponse = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id } = searchParams;
		const animal = await AnimalModel.findById(id).lean();

		if (animal) {
			return NextResponse.json({ success: true, animal: animal }, { status: 200 });
		} else {
			return NextResponse.json({ success: false }, { status: 404 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
