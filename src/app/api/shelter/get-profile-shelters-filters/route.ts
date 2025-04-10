// entities
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// next tools
import { NextResponse } from "next/server";
// shared
import { MarkerCoordinates } from "@/shared/shared/GoogleMap";
import { mongoConnection } from "@/shared/lib/mongodb";
// features
import SelectedFiltersType from "@/features/shelter/filterAllShelters/model/type/selectedFiltersType";
import AvailableFiltersType from "@/features/shelter/filterAllShelters/model/type/availableFiltersType";
import ParsedSearchParamsType from "@/features/shelter/filterProfileShelters/model/type/parsedSearchParamsType";
// mongoose
import { Types } from "mongoose";

async function getAvailableShelterOptions(filters: ParsedSearchParamsType = {}): Promise<{ availableOptions: AvailableFiltersType; shelters: ShelterType[] }> {
	const userId = filters.id ? new Types.ObjectId(filters.id) : null;
	const allStates = await ShelterModel.distinct("state", userId ? { userId } : {});
	const allShelters = await ShelterModel.find(userId ? { userId } : {}).select("state city name coordinates");
	const shelterQuery: { state?: { $in: string[] }; city?: { $in: string[] }; userId?: Types.ObjectId } = userId ? { userId } : {};

	if (filters.state?.length) shelterQuery.state = { $in: filters.state };
	if (filters.city?.length) shelterQuery.city = { $in: filters.city };

	const filteredShelters = await ShelterModel.find(shelterQuery).select("state city name coordinates");
	const state = allStates;
	const city: Record<string, string[]> = {};
	const sheltersList: Record<string, { name: string; coordinates: MarkerCoordinates }> = {};

	allShelters.forEach((shelter) => {
		const stateKey = shelter.state;
		const includeState = !filters.state?.length || filters.state.includes(stateKey);

		if (includeState) {
			if (!city[stateKey]) city[stateKey] = [];
			if (!city[stateKey].includes(shelter.city)) city[stateKey].push(shelter.city);
		}
	});

	filteredShelters.forEach((shelter) => {
		sheltersList[shelter._id.toString()] = {
			name: shelter.name,
			coordinates: shelter.coordinates,
		};
	});

	return {
		availableOptions: {
			state,
			city,
		},
		shelters: filteredShelters,
	};
}

const parseAnimalUrlSearchParams = (urlSearchParams: URLSearchParams): ParsedSearchParamsType => {
	const query = {} as ParsedSearchParamsType;
	urlSearchParams.forEach((value, key) => {
		if (key === "state" || key === "city") {
			query[key] = Array.from(new Set(value.split(",")));
		} else if (key === "id") {
			query[key] = value;
		}
	});
	return query;
};

function validateAnimalSearchParams(searchParams: SelectedFiltersType, availableOptions: AvailableFiltersType): SelectedFiltersType {
	const validatedParams = {
		state: [],
		city: [],
	} as SelectedFiltersType;

	for (const key in searchParams) {
		if (key === "state") {
			if (searchParams[key]) {
				searchParams[key].forEach((state: string) => {
					if (availableOptions.state.includes(state)) {
						if (Array.isArray(validatedParams[key])) {
							validatedParams[key].push(state);
						} else {
							validatedParams[key] = [state];
						}
					}
				});
			}
		} else if (key === "city") {
			if (searchParams[key]) {
				searchParams[key].forEach((city: string) => {
					if (Object.values(availableOptions.city).flat().includes(city)) {
						if (Array.isArray(validatedParams[key])) {
							validatedParams[key].push(city);
						} else {
							validatedParams[key] = [city];
						}
					}
				});
			}
		}
	}
	return validatedParams;
}

export type SuccessResponse = {
	success: true;
	data: {
		availableOptions: AvailableFiltersType;
		selectedOptions: SelectedFiltersType;
		shelters: ShelterType[];
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
		const parsedSearchParams = parseAnimalUrlSearchParams(searchParams);
		const { availableOptions, shelters } = await getAvailableShelterOptions(parsedSearchParams);
		const selectedOptions = validateAnimalSearchParams(parsedSearchParams, availableOptions);

		return NextResponse.json({ success: true, data: { availableOptions, selectedOptions, shelters } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
