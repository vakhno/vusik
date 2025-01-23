import { mongoConnection } from "@/lib/mongodb";
import AnimalModel from "@/entities/animal/model/model";
import { AnimalType } from "@/entities/animal/model/type";
import { NextResponse } from "next/server";
import { validateToNaturalNumber } from "@/utils/number";
import { validateAnimalFilterKeysAndValues } from "@/utils/filter";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { animalsPerPage } from "@/constants/counts";
import { Types } from "mongoose";

export type SuccessResult = {
	success: true;
	animals: AnimalType[];
	isHasMore: boolean;
};

export type ErrorResult = {
	success: false;
};

const applyInOperator = (filterParams: Record<string, any>) => {
	// eslint-disable-line @typescript-eslint/no-explicit-any
	const updatedParams = { ...filterParams };

	for (const key in updatedParams) {
		if (Array.isArray(updatedParams[key])) {
			if (key === "shelterId") {
				const updatedValues = updatedParams[key].map((value) => new Types.ObjectId(value));
				updatedParams[key] = { $in: updatedValues };
			} else {
				updatedParams[key] = { $in: updatedParams[key] };
			}
		}
	}

	return updatedParams;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
	try {
		await mongoConnection();
		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { page, ...filterParams } = searchParams;
		// need to validate to get natural number of the page
		const validatePage = validateToNaturalNumber(page[0]);
		// need to validate animal filters, becaue user can pass non-existing keys, so non-existing keys be removed
		// but we dont check if values of the keys
		const validatedFilterParams = validateAnimalFilterKeysAndValues(filterParams);
		let animals = [];
		let isHasMore = false;
		const { state, ...onlyAnimalFields } = validatedFilterParams;
		const processedAnimalFilters = applyInOperator(onlyAnimalFields);
		console.log("processedAnimalFilters", processedAnimalFilters);
		animals = await AnimalModel.aggregate([
			// Match animals based on fields from validatedFilterParams excluding state
			{
				$match: processedAnimalFilters, // Only match fields that belong to AnimalModel
			},
			// Join with the Shelter collection
			{
				$lookup: {
					from: "shelters", // Name of the shelter collection
					localField: "shelterId", // Field in AnimalModel referencing ShelterModel
					foreignField: "_id", // Field in ShelterModel used for matching
					as: "shelter", // Alias to store the joined data
				},
			},
			// Unwind shelter array to make it a single object
			{
				$unwind: "$shelter",
			},
			// Match the shelter state
			{
				$match: {
					...(state && { "shelter.state": { $in: state } }),
				},
			},
			// Optionally limit the fields from shelter (avoid large data transfer)
			{
				$project: {
					shelter: { state: 1, name: 1 }, // Include only specific fields from shelter
					name: 1,
					species: 1,
					breed: 1,
					size: 1,
					age: 1,
					sex: 1,
					sterilized: 1,
					injury: 1,
				},
			},
			// Pagination
			{
				$skip: (validatePage - 1) * animalsPerPage, // Skip documents for pagination
			},
			{
				$limit: animalsPerPage, // Limit number of documents returned
			},
		]);

		// animals = await AnimalModel.find(validatedFilterParams)
		// 	.skip((validatePage - 1) * animalsPerPage)
		// 	.limit(animalsPerPage)
		// 	.populate({ path: "userId", model: UserModel })
		// 	.populate({ path: "shelterId", model: ShelterModel });
		const totalAnimals = await AnimalModel.countDocuments(validatedFilterParams);

		isHasMore = validatePage * animalsPerPage < totalAnimals;

		return NextResponse.json({ success: true, animals: animals, isHasMore: isHasMore }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
