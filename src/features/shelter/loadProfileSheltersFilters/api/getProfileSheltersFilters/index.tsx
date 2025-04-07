// entities
import ShelterModel from "@/entities/shelter/model/model";
// next tools
import { NextResponse } from "next/server";
// widgets
import { MarkerCoordinates } from "@/shared/shared/GoogleMap";
// features
import SelectedFiltersType from "@/features/shelter/filterAllShelters/model/type/selectedFiltersType";
import AvailableFiltersType from "@/features/shelter/filterAllShelters/model/type/availableFiltersType";
import ParsedSearchParamsType from "@/features/shelter/loadProfileSheltersFilters/model/type/parsedSearchParamsType";
// mongoose
import { Types } from "mongoose";

async function getAvailableShelterOptions(filters: ParsedSearchParamsType = {}): Promise<AvailableFiltersType> {
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
		state,
		city,
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
	availableOptions: AvailableFiltersType;
	selectedOptions: SelectedFiltersType;
};

export type ErrorResponse = {
	success: false;
};

type Props = {
	searchParams: URLSearchParams;
};

const Index = async ({ searchParams }: Props): Promise<NextResponse<SuccessResponse | ErrorResponse>> => {
	try {
		const parsedSearchParams = parseAnimalUrlSearchParams(searchParams);
		const availableOptions = await getAvailableShelterOptions(parsedSearchParams);
		const selectedOptions = validateAnimalSearchParams(parsedSearchParams, availableOptions);

		return NextResponse.json({ success: true, availableOptions, selectedOptions }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
};

export default Index;
