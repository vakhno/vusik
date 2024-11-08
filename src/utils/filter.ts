import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";

export const validateAnimalFilterKeysAndValues = (
	params: Record<string, string[]>,
): Record<keyof AnimalSearchSchemaType, string[] | boolean[]> => {
	const updatedFilters: Record<string, string[] | boolean[]> = {};
	Object.entries(params).forEach(([key, value]) => {
		switch (key) {
			case "injury":
			case "sterilized": {
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
			}
			case "species":
			case "breed":
			case "sex":
			case "age":
			case "size":
			case "shelter": {
				updatedFilters[key] = value;
			}
		}
	});

	return updatedFilters;
};

export const comparingAnimalFilterWithOptions = ({
	options,
	values,
}: Record<"options" | "values", Record<keyof AnimalSearchSchemaType, string[] | boolean[]>>): Record<
	keyof AnimalSearchSchemaType,
	string[] | boolean[]
> => {
	const comparedFilters = {} as Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
	const optionEntries = Object.entries(options) as [keyof AnimalSearchSchemaType, string[] | boolean[]][];

	optionEntries.forEach(([key, _]) => {
		if (key in values) {
			values[key]?.forEach((value: string | boolean) => {
				if (key !== "injury" && key !== "sterilized") {
					if ((options[key] as (string | boolean)[]).includes(value)) {
						if (!comparedFilters[key]) {
							comparedFilters[key] = [];
						}
						(comparedFilters[key] as string[]).push(value as string);
					}
				} else {
					if (!comparedFilters[key]) {
						comparedFilters[key] = [] as boolean[];
					}
					(comparedFilters[key] as boolean[]).push(value as boolean);
				}
			});
		}
	});

	return comparedFilters;
};
