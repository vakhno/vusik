import { mongoConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import SpeciesModel from "@/models/species.model";
import { SpeciesType } from "@/types/species.type";

export interface SuccessResponse {
	success: true;
	species: SpeciesType[];
}

export interface ErrorResponse {
	success: false;
}

export async function GET(): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const species = await SpeciesModel.find();

		if (species) {
			return NextResponse.json({ success: true, species: species }, { status: 200 });
		}
		return NextResponse.json({ success: false }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
