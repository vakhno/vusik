// libs
import { mongoConnection } from "@/shared/lib/mongodb";
// entities
import AnimalModel from "@/entities/animal/model/model";
import { AnimalType } from "@/entities/animal/@x/shelter";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/@x/animal";
// next tools
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	data: {
		availableOptions: ShelterType[] | null;
		selectedOptions: AnimalType | null;
	};
};

export type ErrorResponse = {
	success: false;
};

export async function GET(req: Request) {
	try {
		await mongoConnection();

		const url = new URL(req.url);
		const searchParams = url.searchParams;
		const animalId = searchParams.get("animalId");

		if (animalId) {
			const animal = await AnimalModel.findById(animalId).lean();

			if (animal) {
				let selectedOptions = null;
				let availableOptions = null;

				selectedOptions = animal;

				const shelters = await ShelterModel.find({ userId: animal.userId }).lean();

				if (shelters) {
					availableOptions = shelters;
				}

				return NextResponse.json({ success: true, data: { availableOptions, selectedOptions } }, { status: 200 });
			} else {
				return NextResponse.json({ success: false }, { status: 404 });
			}
		} else {
			return NextResponse.json({ success: false }, { status: 404 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
