// entities
import AnimalModel from "@/entities/animal/model/model";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// next tools
import { NextResponse } from "next/server";
// features
import SelectedFiltersType from "@/features/animal/filterAllAnimals/model/type/selectedFiltersType";
import AvailableFiltersType from "@/features/animal/filterAllAnimals/model/type/availableFiltersType";
import convertSearchParamsToAllAnimalFiltersSchema from "@/features/animal/filterAllAnimals/model/utils/convertSearchParamsToAllAnimalFiltersSchema";
// shared
import { mongoConnection } from "@/shared/lib/mongodb";

async function getAvailableAnimalOptions(filters: SelectedFiltersType = {}): Promise<{ availableOptions: AvailableFiltersType; shelters: ShelterType[] }> {
	const allSpecies = await AnimalModel.distinct("species");
	const allStates = await ShelterModel.distinct("state");
	const allAnimals = await AnimalModel.find({}).select("species breed sex size shelterId");
	const allShelters = await ShelterModel.find({});
	const shelterQuery: { state?: { $in: string[] }; city?: { $in: string[] } } = {};

	if (filters.state?.length) shelterQuery.state = { $in: filters.state };
	if (filters.city?.length) shelterQuery.city = { $in: filters.city };

	const filteredShelters = Object.keys(shelterQuery).length ? await ShelterModel.find(shelterQuery) : allShelters;

	const species = allSpecies;
	const state = allStates;
	const breed: Record<string, string[]> = {};
	const sex: Record<string, string[]> = {};
	const size: Record<string, string[]> = {};
	const city: Record<string, string[]> = {};

	allAnimals.forEach((animal) => {
		const speciesKey = animal.species;
		const includeSpecies = !filters.species?.length || filters.species.includes(speciesKey);

		if (includeSpecies) {
			if (!breed[speciesKey]) breed[speciesKey] = [];
			if (!breed[speciesKey].includes(animal.breed)) breed[speciesKey].push(animal.breed);
			if (!sex[speciesKey]) sex[speciesKey] = [];
			if (!sex[speciesKey].includes(animal.sex)) sex[speciesKey].push(animal.sex);
			if (!size[speciesKey]) size[speciesKey] = [];
			if (!size[speciesKey].includes(animal.size)) size[speciesKey].push(animal.size);
		}
	});

	allShelters.forEach((shelter) => {
		const stateKey = shelter.state;
		const includeState = !filters.state?.length || filters.state.includes(stateKey);

		if (includeState) {
			if (!city[stateKey]) city[stateKey] = [];
			if (!city[stateKey].includes(shelter.city)) city[stateKey].push(shelter.city);
		}
	});

	return {
		availableOptions: { species, state, breed, sex, size, city },
		shelters: filteredShelters,
	};
}

function validateAnimalSearchParams(searchParams: SelectedFiltersType, availableOptions: AvailableFiltersType): SelectedFiltersType {
	const validatedParams = {
		species: [],
		state: [],
		breed: [],
		sex: [],
		size: [],
		city: [],
	} as SelectedFiltersType;

	for (const key in searchParams) {
		if (key === "sterilized" || key === "injury") {
			if (searchParams[key]) {
				if (searchParams[key] === true) {
					validatedParams[key] = true;
				}
			}
		} else if (key === "state") {
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
		} else if (key === "species") {
			if (searchParams[key]) {
				searchParams[key].forEach((species) => {
					if (Array.isArray(validatedParams[key])) {
						validatedParams[key].push(species);
					} else {
						validatedParams[key] = [species];
					}
					Object.keys(searchParams).forEach((speciesOptionKey) => {
						if (speciesOptionKey === "breed" || speciesOptionKey === "sex" || speciesOptionKey === "size") {
							searchParams[speciesOptionKey]?.forEach((value) => {
								if (availableOptions[speciesOptionKey][species].includes(value)) {
									if (Array.isArray(validatedParams[speciesOptionKey])) {
										validatedParams[speciesOptionKey].push(value);
									} else {
										validatedParams[speciesOptionKey] = [value];
									}
								}
							});
						}
					});
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
	error: { message: string; code: number };
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams } = new URL(req.url);
		const parsedSearchParams = convertSearchParamsToAllAnimalFiltersSchema(searchParams);
		const { availableOptions, shelters } = await getAvailableAnimalOptions(parsedSearchParams);
		const selectedOptions = validateAnimalSearchParams(parsedSearchParams, availableOptions);

		return NextResponse.json({ success: true, data: { availableOptions, selectedOptions, shelters } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
