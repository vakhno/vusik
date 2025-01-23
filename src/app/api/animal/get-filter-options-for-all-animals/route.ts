import AnimalModel from "@/entities/animal/model/model";
import ShelterModel from "@/entities/shelter/model/model";
import { AnimalSearchSchemaType } from "@/features/animal/searchAnimal/model/type";
import { NextResponse } from "next/server";
import { validateAnimalFilterKeysAndValues, comparingAnimalFilterWithOptions } from "@/utils/filter";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { AnimalType } from "@/entities/animal/model/type";
import { ShelterType } from "@/entities/shelter/model/type";

export type SuccessResult = {
	success: true;
	availableOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
	selectedOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
};

export type ErrorResult = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
	try {
		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id, ...filterParams } = searchParams;
		// need to validate animal filter kyes and filter values types, becaue user can pass non-existing keys, so non-existing keys be removed
		const validatedAnimalFilterKeysAndValues = validateAnimalFilterKeysAndValues(filterParams);

		const availableAgeOptions = await AnimalModel.distinct("age");
		const availableSexOptions = await AnimalModel.distinct("sex");
		const availableSizeOptions = await AnimalModel.distinct("size");
		const availableBreedOptions = await AnimalModel.distinct("breed");
		const availableSpeciesOptions = await AnimalModel.distinct("species");
		const availableShelterIdOptions = await AnimalModel.distinct("shelterId");
		const availableInjuryIdOptions = await AnimalModel.distinct("injury");
		const availableSterilizedIdOptions = await AnimalModel.distinct("sterilized");

		const availableStateOptions = await ShelterModel.distinct("state");

		const allOptions = {
			age: availableAgeOptions,
			sex: availableSexOptions,
			size: availableSizeOptions,
			breed: availableBreedOptions,
			species: availableSpeciesOptions,
			state: availableStateOptions,
			shelterId: availableShelterIdOptions,
			injury: availableInjuryIdOptions,
			sterilized: availableSterilizedIdOptions,
		} as Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;

		const selectedOptions = comparingAnimalFilterWithOptions({
			options: allOptions,
			values: validatedAnimalFilterKeysAndValues,
		});
		console.log("selectedOptions", allOptions, validatedAnimalFilterKeysAndValues);
		let animals = [];

		if (id && id[0]) {
			animals = await AnimalModel.find({ userId: id[0] }).populate({ path: "shelterId", model: ShelterModel });
		} else {
			animals = await AnimalModel.find().populate({ path: "shelterId", model: ShelterModel });
		}

		const availableOptions = {
			age: Array.from(new Set(animals.map((animal: AnimalType) => animal.age))),
			sex: Array.from(new Set(animals.map((animal: AnimalType) => animal.sex))),
			size: Array.from(new Set(animals.map((animal: AnimalType) => animal.size))),
			state: animals.reduce((allStates: string[], animal: AnimalType & { shelterId: ShelterType }) => {
				const shelter = animal.shelterId;
				if (shelter && shelter.state && !allStates.includes(shelter.state)) {
					allStates.push(shelter.state);
				}
				return allStates;
			}, []),
			breed: Array.from(new Set(animals.map((animal: AnimalType) => animal.breed))),
			species: Array.from(new Set(animals.map((animal: AnimalType) => animal.species))),
			shelterId: animals.reduce((allShelters: ShelterType[], animal: AnimalType & { shelterId: ShelterType }) => {
				// const shelter = animal.shelterId as ShelterType;
				// if (shelter && shelter._id && !allShelters.includes(shelter._id)) {
				// 	allShelters.push(shelter._id);
				// }
				// return allShelters;
				const ifExists = allShelters.some(
					(existShelter: ShelterType) => existShelter._id === animal.shelterId._id,
				);
				if (!ifExists) {
					allShelters.push(animal.shelterId);
				}
				return allShelters;
			}, []),
			injury: Array.from(new Set(animals.map((animal: AnimalType) => animal.injury))),
			sterilized: Array.from(new Set(animals.map((animal: AnimalType) => animal.sterilized))),
		} as Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;

		return NextResponse.json(
			{ success: true, availableOptions: availableOptions, selectedOptions: selectedOptions },
			{ status: 200 },
		);
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
