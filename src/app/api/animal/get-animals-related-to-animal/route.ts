// shared
import { mongoConnection } from "@/shared/lib/mongodb";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
import { RELATED_ANIMALS_COUNT } from "@/shared/constants/counts";
// entities
import AnimalModel from "@/entities/animal/model/model";
import { PopulatedAnimalType } from "@/entities/animal/model/type/animal";
import UserModel from "@/entities/profile/model/model";
import ShelterModel from "@/entities/shelter/model/model";
// next tools
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	data: {
		animals: PopulatedAnimalType[];
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

		const query = {
			_id: { $ne: id },
			species: animal.species,
			breed: animal.breed,
			// status: "available",
		};

		let relatedAnimals = await AnimalModel.find(query).populate({ path: "userId", model: UserModel }).populate({ path: "shelterId", model: ShelterModel }).limit(RELATED_ANIMALS_COUNT).lean<PopulatedAnimalType[]>();

		if (relatedAnimals.length < RELATED_ANIMALS_COUNT) {
			let relatedAnimalsIds = relatedAnimals.map((relatedAnimal) => String(relatedAnimal._id));

			const otherQuery = {
				_id: { $nin: [id, ...relatedAnimalsIds] },
				species: animal.species,
				// status: "available",
			};

			const otherAnimals = await AnimalModel.find(otherQuery)
				.populate({ path: "userId", model: UserModel })
				.populate({ path: "shelterId", model: ShelterModel })
				.limit(RELATED_ANIMALS_COUNT - relatedAnimals.length)
				.lean<PopulatedAnimalType[]>();

			relatedAnimals = [...relatedAnimals, ...otherAnimals];
			if (relatedAnimals.length < RELATED_ANIMALS_COUNT) {
				relatedAnimalsIds = relatedAnimals.map((relatedAnimal) => String(relatedAnimal._id));

				const remainQuery = {
					_id: { $nin: [id, ...relatedAnimalsIds] },
					// status: "available",
				};

				const remainAnimals = await AnimalModel.find(remainQuery)
					.populate({ path: "userId", model: UserModel })
					.populate({ path: "shelterId", model: ShelterModel })
					.limit(RELATED_ANIMALS_COUNT - relatedAnimals.length)
					.lean<PopulatedAnimalType[]>();

				relatedAnimals = [...relatedAnimals, ...remainAnimals];
			}
		}
		return NextResponse.json({ success: true, data: { animals: relatedAnimals } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
