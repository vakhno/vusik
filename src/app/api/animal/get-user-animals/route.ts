import { mongoConnection } from "@/shared/lib/mongodb";
import { NextResponse } from "next/server";
import { AnimalType } from "@/entities/animal/model/type/animal";
import AnimalModel from "@/entities/animal/model/model";

export interface SuccessResponse {
	success: true;
	animals: AnimalType[];
}

export interface ErrorResponse {
	success: false;
}

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const formData = await req.formData();
		// const data = Object.fromEntries(formData.entries()) as { [key: string]: any };
		const animalIds = formData.getAll("animalIds[]") as string[];
		const animals = await AnimalModel.find({ _id: { $in: animalIds } });

		return NextResponse.json({ success: true, animals: animals }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
