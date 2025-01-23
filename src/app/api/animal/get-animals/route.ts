import { mongoConnection } from "@/lib/mongodb";
import AnimalModel from "@/entities/animal/model/model";
import { AnimalType } from "@/entities/animal/model/type";
import { NextResponse } from "next/server";
import { AnimalSearchSchemaType } from "@/features/animal/searchAnimal/model/type";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
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
				if (typeof value === "string" && value.split(",").length > 1) {
					value.split(",").forEach((splitedValue) => {
						splitedValue = splitedValue.trim();
						if (Array.isArray(updatedFilters[key])) {
							(updatedFilters[key] as string[]).push(splitedValue);
						} else {
							updatedFilters[key] = [splitedValue];
						}
					});
				} else {
					updatedFilters[key] = Array.isArray(value) ? value : [value];
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
		const params = gettingValuesFromURLSearchParams(searchParams);
		const validatedParams = validatedFilters(params);
		// const page = pageParam ? Number(pageParam) || 1 : 1;
		const animals = await AnimalModel.find(validatedParams);

		return NextResponse.json({ success: true, animals: animals }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
