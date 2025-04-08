// shared
import { mongoConnection } from "@/shared/lib/mongodb";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
// entities
import AnimalModel from "@/entities/animal/model/model";
import { PopulatedAnimalType } from "@/entities/animal/model/type/animal";
import ShelterModel from "@/entities/shelter/model/model";
import UserModel from "@/entities/profile/model/model";
// next tools
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	data: {
		animal: PopulatedAnimalType;
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

		if (!id) {
			return NextResponse.json({ success: false, error: { message: "", code: 400 } }, { status: 400 });
		}

		const animal = await AnimalModel.findById(id).populate({ path: "userId", model: UserModel }).populate({ path: "shelterId", model: ShelterModel }).lean<PopulatedAnimalType>();

		if (!animal) {
			return NextResponse.json({ success: false, error: { message: "", code: 404 } }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: { animal: animal } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
