// import { AnimalSearchSchemaType } from "@/features/animal/searchAnimal/model/type";
import { ShelterSearchSchemaType } from "@/entities/shelter/model/type/shelterSearch";
import { ArticleSearchSchemaType } from "@/entities/article/model/type/articleSearch";

// export const validateAnimalFilterKeysAndValues = (
// 	params: Record<string, string[]>,
// ): Record<keyof AnimalSearchSchemaType, string[] | boolean[]> => {
// 	const updatedFilters: Record<string, string[] | boolean[]> = {};
// 	Object.entries(params).forEach(([key, value]) => {
// 		switch (key) {
// 			case "injury":
// 			case "sterilized":
// 				{
// 					if (value) {
// 						updatedFilters[key] = true;
// 					}
// 				}
// 				break;
// 			case "species":
// 			case "breed":
// 			case "sex":
// 			case "age":
// 			case "size":
// 			case "state":
// 			case "shelterId":
// 				{
// 					updatedFilters[key] = value;
// 				}
// 				break;
// 		}
// 	});

// 	return updatedFilters;
// };

// export const comparingAnimalFilterWithOptions = ({
// 	options,
// 	values,
// }: Record<"options" | "values", Record<keyof AnimalSearchSchemaType, string[] | boolean[]>>): Record<
// 	keyof AnimalSearchSchemaType,
// 	string[] | boolean[]
// > => {
// 	const comparedFilters = {} as Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
// 	const optionEntries = Object.entries(options) as [keyof AnimalSearchSchemaType, string[] | boolean[]][];

// 	optionEntries.forEach(([key, _]) => {
// 		if (key in values) {
// 			values[key]?.forEach((value: string | boolean) => {
// 				if (key !== "injury" && key !== "sterilized") {
// 					if (String(options[key]).includes(String(value))) {
// 						if (!comparedFilters[key]) {
// 							comparedFilters[key] = [];
// 						}
// 						(comparedFilters[key] as string[]).push(value as string);
// 					}
// 				} else {
// 					if (!comparedFilters[key]) {
// 						comparedFilters[key] = [] as boolean[];
// 					}
// 					(comparedFilters[key] as boolean[]).push(value as boolean);
// 				}
// 			});
// 		}
// 	});

// 	return comparedFilters;
// };

export const validateShelterFilterKeysAndValues = (
	params: Record<string, string[]>,
): Record<keyof ShelterSearchSchemaType, string[]> => {
	const updatedFilters: Record<string, string[]> = {};
	Object.entries(params).forEach(([key, value]) => {
		switch (key) {
			case "city":
			case "state":
				{
					updatedFilters[key] = value;
				}
				break;
		}
	});

	return updatedFilters;
};

export const comparingShelterFilterWithOptions = ({
	options,
	values,
}: Record<"options" | "values", Record<keyof ShelterSearchSchemaType, string[]>>): Record<
	keyof ShelterSearchSchemaType,
	string[]
> => {
	const comparedFilters = {} as Record<keyof ShelterSearchSchemaType, string[]>;
	const optionEntries = Object.entries(options) as [keyof ShelterSearchSchemaType, string[]][];

	optionEntries.forEach(([key, _]) => {
		if (key in values) {
			values[key]?.forEach((value: string) => {
				if ((options[key] as string[]).includes(value)) {
					if (!comparedFilters[key]) {
						comparedFilters[key] = [];
					}
					(comparedFilters[key] as string[]).push(value as string);
				}
			});
		}
	});

	return comparedFilters;
};

export const validateArticleFilterKeysAndValues = (
	params: Record<string, string[]>,
): Record<keyof ArticleSearchSchemaType, string[]> => {
	const updatedFilters: Record<string, string[]> = {};
	Object.entries(params).forEach(([key, value]) => {
		switch (key) {
			case "category":
				{
					updatedFilters[key] = value;
				}
				break;
		}
	});

	return updatedFilters;
};

export const comparingArticleFilterWithOptions = ({
	options,
	values,
}: Record<"options" | "values", Record<keyof ArticleSearchSchemaType, string[]>>): Record<
	keyof ArticleSearchSchemaType,
	string[]
> => {
	const comparedFilters = {} as Record<keyof ArticleSearchSchemaType, string[]>;
	const optionEntries = Object.entries(options) as [keyof ArticleSearchSchemaType, string[]][];

	optionEntries.forEach(([key, _]) => {
		if (key in values) {
			values[key]?.forEach((value: string) => {
				if ((options[key] as string[]).includes(value)) {
					if (!comparedFilters[key]) {
						comparedFilters[key] = [];
					}
					(comparedFilters[key] as string[]).push(value as string);
				}
			});
		}
	});

	return comparedFilters;
};
