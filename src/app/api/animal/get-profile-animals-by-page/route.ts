// libs
import { mongoConnection } from "@/shared/lib/mongodb";
// entities
import AnimalModel from "@/entities/animal/model/model";
import { AnimalType } from "@/entities/animal/model/type/animal";
import ShelterModel from "@/entities/shelter/model/model";
import UserModel from "@/entities/profile/model/model";
// next tools
import { NextResponse } from "next/server";
// utils
import { validateToNaturalNumber } from "@/shared/utils/number";
// constants
import { ANIMALS_PER_PAGE } from "@/shared/constants/counts";
// mongoose
import { Types } from "mongoose";

type parsedAnimalSearchParamsType = {
	injury?: boolean;
	sterilized?: boolean;
	state?: string[];
	city?: string[];
	species?: string[];
	breed?: string[];
	size?: string[];
	sex?: string[];
	page?: number;
	id?: string;
};

const parseAnimalUrlSearchParams = (urlSearchParams: URLSearchParams): parsedAnimalSearchParamsType => {
	const query = {} as parsedAnimalSearchParamsType;

	urlSearchParams.forEach((value, key) => {
		if (key === "injury" || key === "sterilized") {
			query[key] = value === "true";
		} else if (key === "id") {
			query[key] = value;
		} else if (key === "page") {
			query[key] = validateToNaturalNumber(value);
		} else if (key === "state" || key === "city" || key === "species" || key === "breed" || key === "sex" || key === "size") {
			query[key] = Array.from(new Set(value.split(",")));
		}
	});

	return query;
};

export type SuccessResponse = {
	success: true;
	data: {
		animals: AnimalType[];
		isHasMore: boolean;
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

		const { searchParams } = new URL(req.url);
		const parsedParams = parseAnimalUrlSearchParams(searchParams);
		const { page = 1, id, ...filterParams } = parsedParams;
		const validatedFilters = filterParams;

		let shelterIds: Types.ObjectId[] = [];

		if (validatedFilters.state || validatedFilters.city) {
			const shelterQuery: { state?: { $in: string[] }; city?: { $in: string[] } } = {};

			if (validatedFilters.state) shelterQuery.state = { $in: validatedFilters.state };
			if (validatedFilters.city) shelterQuery.city = { $in: validatedFilters.city };

			const shelters = await ShelterModel.find(shelterQuery).select("_id");

			shelterIds = shelters.map((s) => s._id);
		}

		const animalQuery: {
			shelterId?: { $in: Types.ObjectId[] };
			injury?: boolean;
			sterilized?: boolean;
			species?: { $in: string[] };
			breed?: { $in: string[] };
			size?: { $in: string[] };
			sex?: { $in: string[] };
		} = {};

		if (shelterIds.length > 0) animalQuery.shelterId = { $in: shelterIds };
		if (validatedFilters.injury !== undefined) animalQuery.injury = validatedFilters.injury;
		if (validatedFilters.sterilized !== undefined) animalQuery.sterilized = validatedFilters.sterilized;
		if (validatedFilters.species) animalQuery.species = { $in: validatedFilters.species };
		if (validatedFilters.breed) animalQuery.breed = { $in: validatedFilters.breed };
		if (validatedFilters.size) animalQuery.size = { $in: validatedFilters.size };
		if (validatedFilters.sex) animalQuery.sex = { $in: validatedFilters.sex };

		const animals = await AnimalModel.find({ ...animalQuery, userId: id })
			.skip((page - 1) * ANIMALS_PER_PAGE)
			.limit(ANIMALS_PER_PAGE)
			.populate({ path: "userId", model: UserModel })
			.populate({ path: "shelterId", model: ShelterModel });

		const totalAnimals = await AnimalModel.countDocuments({ ...animalQuery, userId: id });
		const isHasMore = page * ANIMALS_PER_PAGE < totalAnimals;

		return NextResponse.json({ success: true, data: { animals, isHasMore } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
