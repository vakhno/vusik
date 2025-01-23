import { mongoConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ShelterType } from "@/entities/shelter/model/type";
import ShelterModel from "@/entities/shelter/model/model";

export interface SuccessResponse {
	success: true;
	shelters: ShelterType[];
}

export interface ErrorResponse {
	success: false;
}

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const formData = await req.formData();
		// const data = Object.fromEntries(formData.entries()) as { [key: string]: any };
		const shelterIds = formData.getAll("shelterIds[]") as string[];
		const shelters = await ShelterModel.find({ _id: { $in: shelterIds } });

		return NextResponse.json({ success: true, shelters: shelters }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
