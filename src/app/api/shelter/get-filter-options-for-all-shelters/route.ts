// import ShelterModel from "@/entities/shelter/model/model";
// import { ShelterSearchSchemaType } from "@/entities/shelter/model/type/shelterSearch";
// import { NextResponse } from "next/server";
// import { validateShelterFilterKeysAndValues, comparingShelterFilterWithOptions } from "@/utils/filter";
// import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
// import { ShelterType } from "@/entities/shelter/model/type/shelter";

// export type SuccessResult = {
// 	success: true;
// 	availableOptions: Record<keyof ShelterSearchSchemaType, string[] | boolean[]>;
// 	selectedOptions: Record<keyof ShelterSearchSchemaType, string[] | boolean[]>;
// };

// export type ErrorResult = {
// 	success: false;
// };

// export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
// 	try {
// 		const { searchParams: URLSearchParams } = new URL(req.url);
// 		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
// 		const { id, ...filterParams } = searchParams;
// 		// need to validate shelter filter kyes and filter values types, becaue user can pass non-existing keys, so non-existing keys be removed
// 		const validatedShelterFilterKeysAndValues = validateShelterFilterKeysAndValues(filterParams);
// 		const availableCityOptions = await ShelterModel.distinct("city");
// 		const availableStateOptions = await ShelterModel.distinct("state");

// 		const allOptions = {
// 			city: availableCityOptions,
// 			state: availableStateOptions,
// 		} as Record<keyof ShelterSearchSchemaType, string[]>;

// 		const selectedOptions = comparingShelterFilterWithOptions({
// 			options: allOptions,
// 			values: validatedShelterFilterKeysAndValues,
// 		});
// 		let shelters = [];

// 		if (id && id[0]) {
// 			shelters = await ShelterModel.find({ userId: id[0] });
// 		} else {
// 			shelters = await ShelterModel.find();
// 		}

// 		const availableSheltersCoordinates = await ShelterModel.find(selectedOptions).distinct("coordinates");

// 		const availableOptions = {
// 			city: Array.from(new Set(shelters.map((shelter: ShelterType) => shelter.city))),
// 			state: Array.from(new Set(shelters.map((shelter: ShelterType) => shelter.state))),
// 			coordinates: availableSheltersCoordinates,
// 		} as Record<keyof ShelterSearchSchemaType, string[] | boolean[]>;

// 		return NextResponse.json(
// 			{ success: true, availableOptions: availableOptions, selectedOptions: selectedOptions },
// 			{ status: 200 },
// 		);
// 	} catch (_) {
// 		return NextResponse.json({ success: false }, { status: 500 });
// 	}
// }

import { NextResponse } from "next/server";
import getAllSheltersFilters, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/shelter/loadAllSheltersFilters/api/getAllSheltersFilters";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getAllSheltersFilters({ searchParams: URLSearchParams });
	return result;
}
