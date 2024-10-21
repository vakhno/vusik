import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";

export const urlSearchParamsBuilder = (
	params: Record<string, string | number | boolean | string[]>,
): URLSearchParams => {
	const urlSearchParams = new URLSearchParams();

	if (params && Object.keys(params).length) {
		Object.entries(params).forEach(([key, value]) => {
			if (typeof value === "string") {
				urlSearchParams.set(key, value);
			} else if (typeof value === "number") {
				// checking if number is not Infinity, -Infinity or NaN
				if (isFinite(value) && !isNaN(value)) {
					urlSearchParams.set(key, String(value));
				}
			} else if (typeof value === "boolean") {
				// will be passed only 'true' boolean
				if (value) {
					urlSearchParams.set(key, String(value));
				}
			} else if (Array.isArray(value)) {
				if (value.length) {
					value.forEach((value) => urlSearchParams.append(key, String(value)));
				}
			}
		});
	}

	return urlSearchParams;
};

export const searchParamsToAnimalSearchSchemaType = (): Partial<AnimalSearchSchemaType> => {
	const filters = {};

	return filters;
};

// export const urlSearchParamsBuilder = (searchParams: Record<string, string | string[]>): URLSearchParams => {
// 	const urlSearchParams = new URLSearchParams();

// 	if (searchParams && Object.keys(searchParams).length) {
// 		Object.entries(searchParams).forEach(([key, value]) => {
// 			if (typeof value === "string") {
// 				urlSearchParams.set(key, value);
// 			} else if (Array.isArray(value)) {
// 				if (value.length) {
// 					value.forEach((value) => urlSearchParams.append(key, value));
// 				}
// 			}
// 		});
// 	}

// 	return urlSearchParams;
// };

// const buildingUrlSearchParams = (values: Partial<AnimalSearchSchemaType>): URLSearchParams => {
// 	let searchParams = new URLSearchParams();

// 	if (values) {
// 		if (values?.species && values.species.length) {
// 			searchParams.append("species", values.species.join(","));
// 		}
// 		if (values?.breed && values.breed.length) {
// 			searchParams.append("breed", values.breed.join(","));
// 		}
// 		if (values?.sex && values.sex.length) {
// 			searchParams.append("sex", values.sex.join(","));
// 		}
// 		if (values?.size && values.size.length) {
// 			searchParams.append("size", values.size.join(","));
// 		}
// 		if (values?.age && values.age.length) {
// 			searchParams.append("age", values.age.join(","));
// 		}
// 		if (values?.shelter && values.shelter.length) {
// 			searchParams.append("shelter", values.shelter.join(","));
// 		}
// 		if (values?.sterilized) {
// 			searchParams.set("sterilized", "true");
// 		}
// 		if (values?.injury) {
// 			searchParams.set("injury", "true");
// 		}
// 	}

// 	return searchParams;
// };

export const animalFilterUrlSearchParamBuilder = (searchParams: Record<string, string | string[]>) => {
	const urlSearchParams = new URLSearchParams();

	if (searchParams && Object.keys(searchParams).length) {
		Object.entries(searchParams).forEach(([key, value]) => {
			// const option = options[key as keyof OptionRecord];

			if (key === "injury" || key === "sterilized") {
				if (value === "true") {
					updatedFilters[key] = true;
				} else if (value === "false") {
					updatedFilters[key] = false;
				}
			} else {
				if (value.split(",").length > 1) {
					value.split(",").forEach((splitedValue) => {
						splitedValue = splitedValue.trim();
						if (option[0].values.some((optionValue) => optionValue.value === splitedValue)) {
							if (updatedFilters[key] && updatedFilters[key].length) {
								updatedFilters[key].push(splitedValue);
							} else {
								updatedFilters[key] = [splitedValue];
							}
						}
					});
				} else {
					if (option[0].values.some((optionValue) => optionValue.value === value)) {
						updatedFilters[key] = [value];
					}
				}
			}
		});
	}

	return urlSearchParams;
};
