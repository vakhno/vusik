import { mongoConnection } from "@/lib/mongodb";
import AnimalModel from "@/models/animal.model";
import { AnimalType } from "@/types/animal.type";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { NextResponse } from "next/server";

type SuccessResponse = {
	success: true;
	animal: AnimalType;
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
		const animal = await AnimalModel.findById(id);

		return NextResponse.json({ success: true, animal: animal }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
