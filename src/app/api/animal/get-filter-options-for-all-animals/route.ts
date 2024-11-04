import AnimalModel from "@/models/animal.model";
import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";
import { NextResponse } from "next/server";
import { validateAnimalFilterKeysAndValues, comparingAnimalFilterWithOptions } from "@/utils/filter";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { AnimalType } from "@/types/animal.type";
import { Types } from "mongoose";

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

		const allOptions = {
			age: availableAgeOptions,
			sex: availableSexOptions,
			size: availableSizeOptions,
			breed: availableBreedOptions,
			species: availableSpeciesOptions,
			shelter: availableShelterIdOptions,
			injury: availableInjuryIdOptions,
			sterilized: availableSterilizedIdOptions,
		} as Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;

		const selectedOptions = comparingAnimalFilterWithOptions({
			options: allOptions,
			values: validatedAnimalFilterKeysAndValues,
		});

		let animals = [];

		if (id && id[0]) {
			animals = await AnimalModel.find({ userId: id[0] }).populate("shelterId");
		} else {
			animals = await AnimalModel.find().populate("shelterId");
		}

		const availableOptions = {
			age: Array.from(new Set(animals.map((animal: AnimalType) => animal.age))),
			sex: Array.from(new Set(animals.map((animal: AnimalType) => animal.sex))),
			size: Array.from(new Set(animals.map((animal: AnimalType) => animal.size))),
			breed: Array.from(new Set(animals.map((animal: AnimalType) => animal.breed))),
			species: Array.from(new Set(animals.map((animal: AnimalType) => animal.species))),
			shelter: animals.reduce((allShelters: Types.ObjectId[], animal: AnimalType) => {
				const ifExists = allShelters.some(
					(existShelter: Types.ObjectId) => existShelter._id === animal.shelterId._id,
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
