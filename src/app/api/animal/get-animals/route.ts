import { mongoConnection } from "@/lib/mongodb";
import AnimalModel from "@/models/animal.model";
import { AnimalType } from "@/types/animal.type";
import { NextResponse } from "next/server";
import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";

type SuccessResponse = {
	success: true;
	animals: AnimalType[];
};

type ErrorResponse = {
	success: false;
};

const validatedFilters = (
	params: Record<keyof AnimalSearchSchemaType, string | string[]>,
): Partial<AnimalSearchSchemaType> => {
	const updatedFilters: Record<string, boolean | string[]> = {};
	Object.entries(params).forEach(([key, value]) => {
		if ([key].includes(key as keyof AnimalSearchSchemaType)) {
			if (key === "injury" || key === "sterilized") {
				if (value === "true") {
					updatedFilters[key] = true;
				} else if (value === "false") {
					updatedFilters[key] = false;
				}
			} else {
				if (value.split(",").length > 1) {
					value.split(",").forEach((splitedValue) => {
						splitedValue = splitedValue.trim();
						if (updatedFilters[key] && updatedFilters[key].length) {
							updatedFilters[key].push(splitedValue);
						} else {
							updatedFilters[key] = [splitedValue];
						}
					});
				} else {
					updatedFilters[key] = [value];
				}
			}
		}
	});

	return updatedFilters;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();
		const { searchParams } = new URL(req.url);
		const params = Object.fromEntries(searchParams.entries());
		const validatedParams = validatedFilters(params);
		// const page = pageParam ? Number(pageParam) || 1 : 1;
		const animals = await AnimalModel.find(validatedParams);

		return NextResponse.json({ success: true, animals: animals }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
