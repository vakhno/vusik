import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";

export const validateAnimalFilterKeysAndValues = (
	params: Record<string, string[]>,
	// params: Record<keyof AnimalSearchSchemaType, string[]>,
): Record<keyof AnimalSearchSchemaType, string[] | boolean[]> => {
	const updatedFilters: Record<string, string[] | boolean[]> = {};
	// VALUES OF species, breed, sex, age, size, shelter CAN BE NOT VALID o this stage
	Object.entries(params).forEach(([key, value]) => {
		if (key === "injury" || key === "sterilized") {
			const booleanValues: boolean[] = [];
			value.forEach((val) => {
				if (val === "true") {
					booleanValues.push(true);
				} else if (val === "false") {
					booleanValues.push(false);
				}
			});
			if (booleanValues.length) {
				updatedFilters[key] = booleanValues;
			}
		} else if (
			key === "species" ||
			key === "breed" ||
			key === "sex" ||
			key === "age" ||
			key === "size" ||
			key === "shelter"
		) {
			updatedFilters[key] = value;
		}
	});

	return updatedFilters;
};

type Props = {
	options: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
	values: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
};

export const comparingAnimalFilterWithOptions = ({
	options,
	values,
}: Props): Record<keyof AnimalSearchSchemaType, string[] | boolean[]> => {
	const comparedFilters = {} as Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
	const optionEntries = Object.entries(options) as [keyof AnimalSearchSchemaType, string[] | boolean[]][];

	optionEntries.forEach(([key, _]) => {
		if (key in values) {
			values[key]?.forEach((value: string | boolean) => {
				if (key !== "injury" && key !== "sterilized") {
					if (options[key].includes(value)) {
						if (comparedFilters[key]) {
							comparedFilters[key]?.push(value);
						} else {
							comparedFilters[key] = [value];
						}
					}
				} else {
					comparedFilters[key] = [value];
				}
			});
		}
	});

	return comparedFilters;
};
