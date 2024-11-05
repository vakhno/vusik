import { mongoConnection } from "@/lib/mongodb";
import AnimalModel from "@/models/animal.model";
import { AnimalType } from "@/types/animal.type";
import { NextResponse } from "next/server";
import { validateToNaturalNumber } from "@/utils/number";
import { validateAnimalFilterKeysAndValues } from "@/utils/filter";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { animalsPerPage } from "@/constants/counts";

export type SuccessResult = {
	success: true;
	animals: AnimalType[];
	isHasMore: boolean;
};

export type ErrorResult = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
	try {
		await mongoConnection();
		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { page, id, ...filterParams } = searchParams;
		// need to validate to get natural number of the page
		const validatePage = validateToNaturalNumber(page[0]);
		// need to validate animal filters, becaue user can pass non-existing keys, so non-existing keys be removed
		// but we dont check if values of the keys
		const validatedFilterParams = validateAnimalFilterKeysAndValues(filterParams);

		let animals = [];
		let isHasMore = false;

		if (id && id[0]) {
			animals = await AnimalModel.find({ ...validatedFilterParams, userId: id[0] })
				.skip((validatePage - 1) * animalsPerPage)
				.limit(animalsPerPage);
			const totalAnimals = await AnimalModel.countDocuments({ ...validatedFilterParams, userId: id[0] });
			isHasMore = validatePage * animalsPerPage < totalAnimals;
		} else {
			animals = await AnimalModel.find(validatedFilterParams)
				.skip((validatePage - 1) * animalsPerPage)
				.limit(animalsPerPage);
			const totalAnimals = await AnimalModel.countDocuments(validatedFilterParams);

			isHasMore = validatePage * animalsPerPage < totalAnimals;
		}

		return NextResponse.json({ success: true, animals: animals, isHasMore: isHasMore }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
