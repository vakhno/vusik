// entities
import AnimalModel from "@/entities/animal/model/model";
import { AnimalType } from "@/entities/animal/model/type/animal";
import ShelterModel from "@/entities/shelter/model/model";
import UserModel from "@/entities/profile/model/model";
// next tools
import { NextResponse } from "next/server";
// shared
import { animalsPerPage } from "@/shared/constants/counts";
import { mongoConnection } from "@/shared/lib/mongodb";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
// mongoose
import { Types } from "mongoose";
// features
import AnimalFiltersByPageType from "@/features/animal/loadAllAnimals/model/types/AnimalFiltersByPageType";

type AnimalQueryType = {
	shelterId?: { $in: Types.ObjectId[] };
	injury?: boolean;
	sterilized?: boolean;
	species?: { $in: string[] };
	breed?: { $in: string[] };
	size?: { $in: string[] };
	sex?: { $in: string[] };
};

const buildAnimalsQuery = async (filterParams: AnimalFiltersByPageType) => {
	let shelterIds: Types.ObjectId[] = [];

	if (filterParams.state || filterParams.city) {
		const shelterQuery: { state?: { $in: string[] }; city?: { $in: string[] } } = {};

		if (filterParams.state) shelterQuery.state = { $in: filterParams.state };
		if (filterParams.city) shelterQuery.city = { $in: filterParams.city };

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
	if (filterParams.injury !== undefined) animalQuery.injury = filterParams.injury;
	if (filterParams.sterilized !== undefined) animalQuery.sterilized = filterParams.sterilized;
	if (filterParams.species) animalQuery.species = { $in: filterParams.species };
	if (filterParams.breed) animalQuery.breed = { $in: filterParams.breed };
	if (filterParams.size) animalQuery.size = { $in: filterParams.size };
	if (filterParams.sex) animalQuery.sex = { $in: filterParams.sex };

	return animalQuery;
};

const generateAnimals = async (page: number, animalQuery: AnimalQueryType) => {
	const animals = await AnimalModel.find(animalQuery)
		.skip((page - 1) * animalsPerPage)
		.limit(animalsPerPage)
		.populate({ path: "userId", model: UserModel })
		.populate({ path: "shelterId", model: ShelterModel });
	return animals;
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
		const parsedParams = convertURLSearchParamsToObject(searchParams);
		const { page = 1 } = parsedParams;
		const animalQuery = await buildAnimalsQuery(parsedParams);
		const animals = await generateAnimals(Number(page), animalQuery);
		const totalAnimals = await AnimalModel.countDocuments(animalQuery);
		const isHasMore = Number(page) * animalsPerPage < totalAnimals;

		return NextResponse.json({ success: true, data: { animals, isHasMore } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
