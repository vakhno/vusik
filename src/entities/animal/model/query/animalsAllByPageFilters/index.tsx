// // tanstack
// import { useQuery, QueryClient } from "@tanstack/react-query";
// // utils
// import { urlSearchParamsBuilder } from "@/utils/searchParams";
// // api
// import { SuccessResult, ErrorResult } from "@/app/api/animal/get-all-animals-filters/route";
// // routes
// import { API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS } from "@/routes";
// // types
// import { SearchParamsType } from "@/types/searchParams.type";
// import { species } from "@/constants/species";
// import { MarkerCoordinates } from "@/widget/googleMap/map";
// import { ShelterType } from "@/entities/shelter/model/type/shelter";
// import { Option } from "@/shared/formUi/formAutocompleteMiltiselect";
// import { FiltersPopulatedAnimalsType } from "@/entities/filter/model/type/filtersPopulated";
// import { APIResponse as getAllAnimalsPopulatedFiltersAPIResponse } from "@/app/api/filters/get-all-animals-populated-filters/route";
// type Props = {
// 	searchParams: SearchParamsType;
// };

// type QueryResult = Omit<SuccessResult, "success"> | null;

// type PrefetchResult = Omit<SuccessResult, "success"> | null;

// const preparingAvailableFilterFields = (filters: FiltersPopulatedAnimalsType) => {
// 	const { species, states, cities, shelters } = filters;

// 	const shelterMarkersList = shelters.map((shelter: ShelterType) => shelter.coordinates);

// 	const sheltersOptionList = shelters.map((shelter: ShelterType) => ({
// 		values: [{ label: String(shelter.name), value: String(shelter._id) }],
// 	})) as Option[];

// 	const statesOptionList = Object.keys(states).map((state: string) => ({
// 		values: [{ label: state, value: state }],
// 	})) as Option[];

// 	const citiesOptionList = Object.keys(cities).map((city: string) => ({
// 		values: [{ label: city, value: city }],
// 	})) as Option[];
// 	const speciesOptionList = Object.keys(species).map((species: string) => ({
// 		values: [{ label: species, value: species }],
// 	})) as Option[];

// 	const speciesBreedsOptionList = {} as Record<string, Option>;
// 	for (const key in species) {
// 		speciesBreedsOptionList[key] = {
// 			heading: { label: key, value: key },
// 			values: Object.keys(species[key].breeds).map((breed) => ({
// 				label: breed,
// 				value: breed,
// 			})),
// 		};
// 	}

// 	const speciesSizesOptionList = {} as Record<string, Option>;
// 	for (const key in species) {
// 		speciesSizesOptionList[key] = {
// 			heading: { label: key, value: key },
// 			values: Object.keys(species[key].size).map((size) => ({
// 				label: size,
// 				value: size,
// 			})),
// 		};
// 	}

// 	const speciesSexOptionList = {} as Record<string, Option>;
// 	for (const key in species) {
// 		speciesSexOptionList[key] = {
// 			heading: { label: key, value: key },
// 			values: Object.keys(species[key].sex).map((sex) => ({
// 				label: sex,
// 				value: sex,
// 			})),
// 		};
// 	}

// };

// const fetchAnimalFilters = async (searchParams: SearchParamsType) => {
// 	// try {
// 	// 	const urlSearchParams = urlSearchParamsBuilder(searchParams);
// 	// 	const response = await fetch(
// 	// 		`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/filters/get-all-animals-populated-filters`,
// 	// 		{
// 	// 			method: "GET",
// 	// 		},
// 	// 	);
// 	// 	const { ok } = response;
// 	// 	if (ok) {
// 	// 		const data = (await response.json()) as getAllAnimalsPopulatedFiltersAPIResponse;
// 	// 		const { success } = data;
// 	// 		if (success) {
// 	// 			const { filters } = data;
// 	// 			console.log("DATA", data);
// 	// 			const preparedAvailableFilters = preparingAvailableFilterFields(filters)

// 	// 			// return { shelterMarkers: shelterMarkersList };
// 	// 		}
// 	// 	}
// 	// } catch (_) {
// 	// 	return null;
// 	// }
// 	try {
// 		const urlSearchParams = urlSearchParamsBuilder(searchParams);
// 		const response = await fetch(
// 			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS}/?${urlSearchParams}`,
// 			{
// 				method: "GET",
// 			},
// 		);

// 		const { ok } = response;

// 		if (ok) {
// 			const data = await response.json();
// 			const { success } = data as SuccessResult | ErrorResult;

// 			if (success) {
// 				const { availableOptions, selectedOptions } = data;

// 				return { availableOptions: availableOptions, selectedOptions: selectedOptions };
// 			}
// 		}

// 		return null;
// 	} catch (_) {
// 		return null;
// 	}
// };

// const fetchData = async (searchParams: SearchParamsType) => {
// 	const filters = await fetchAnimalFilters(searchParams);
// 	if (filters) {
// 		return filters;
// 	}
// 	return null;
// };

// export const queryGetAllAnimalsFilter = ({ searchParams }: Props) => {
// 	return useQuery({
// 		queryKey: ["all-animals-filter", searchParams],
// 		gcTime: 5 * 60 * 1000,
// 		staleTime: 5 * 60 * 1000,
// 		refetchOnMount: false, // Do not refetch on mount
// 		refetchOnReconnect: false,
// 		queryFn: async (): Promise<QueryResult> => {
// 			return fetchData(searchParams);
// 		},
// 	});
// };

// export const queryPrefetchGetAllAnimalsFilter = async ({ searchParams }: Props) => {
// 	const queryClient = new QueryClient();

// 	await queryClient.prefetchQuery({
// 		queryKey: ["all-animals-filter", searchParams],
// 		gcTime: 5 * 60 * 1000,
// 		staleTime: 5 * 60 * 1000,
// 		queryFn: async (): Promise<PrefetchResult> => {
// 			return fetchData(searchParams);
// 		},
// 	});

// 	return queryClient;
// };

// export const queryGetAllAnimalsFilterInvalidate = ({ searchParams }: Props) => {
// 	const queryClient = new QueryClient();
// 	queryClient.invalidateQueries({ queryKey: ["all-animals-filter", searchParams] });
// };

// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";
// api
import { SuccessResponse, ErrorResponse } from "@/app/api/animal/get-all-animals-filters/route";
// routes
import { API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS } from "@/routes";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

type FetchResult = Omit<SuccessResponse, "success"> | null;

// const preparingAvailableFilterFields = (filters: FiltersPopulatedAnimalsType) => {
// 	const { species, states, cities, shelters } = filters;

// 	const shelterMarkersList = shelters.map((shelter: ShelterType) => shelter.coordinates);

// 	const sheltersOptionList = shelters.map((shelter: ShelterType) => ({
// 		values: [{ label: String(shelter.name), value: String(shelter._id) }],
// 	})) as Option[];

// 	const statesOptionList = Object.keys(states).map((state: string) => ({
// 		values: [{ label: state, value: state }],
// 	})) as Option[];

// 	const citiesOptionList = Object.keys(cities).map((city: string) => ({
// 		values: [{ label: city, value: city }],
// 	})) as Option[];
// 	const speciesOptionList = Object.keys(species).map((species: string) => ({
// 		values: [{ label: species, value: species }],
// 	})) as Option[];

// 	const speciesBreedsOptionList = {} as Record<string, Option>;
// 	for (const key in species) {
// 		speciesBreedsOptionList[key] = {
// 			heading: { label: key, value: key },
// 			values: Object.keys(species[key].breeds).map((breed) => ({
// 				label: breed,
// 				value: breed,
// 			})),
// 		};
// 	}

// 	const speciesSizesOptionList = {} as Record<string, Option>;
// 	for (const key in species) {
// 		speciesSizesOptionList[key] = {
// 			heading: { label: key, value: key },
// 			values: Object.keys(species[key].size).map((size) => ({
// 				label: size,
// 				value: size,
// 			})),
// 		};
// 	}

// 	const speciesSexOptionList = {} as Record<string, Option>;
// 	for (const key in species) {
// 		speciesSexOptionList[key] = {
// 			heading: { label: key, value: key },
// 			values: Object.keys(species[key].sex).map((sex) => ({
// 				label: sex,
// 				value: sex,
// 			})),
// 		};
// 	}
// };

const fetchAnimalFilters = async (searchParams: SearchParamsType): Promise<FetchResult> => {
	try {
		const urlSearchParams = urlSearchParamsBuilder(searchParams);
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS}/?${urlSearchParams}`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data as SuccessResponse | ErrorResponse;

			if (success) {
				const { availableOptions, selectedOptions } = data;

				return { availableOptions: availableOptions, selectedOptions: selectedOptions };
			}
		}

		return null;
	} catch (_) {
		return null;
	}
};

const fetchData = async (searchParams: SearchParamsType): Promise<FetchResult> => {
	const filters = await fetchAnimalFilters(searchParams);
	if (filters) {
		return filters;
	}
	return null;
};

export const queryGetAllAnimalsFilter = ({ searchParams }: Props) => {
	return useQuery({
		queryKey: ["all-animals-filter", searchParams],
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
		queryFn: async (): Promise<FetchResult> => {
			return fetchData(searchParams);
		},
	});
};

export const queryPrefetchGetAllAnimalsFilter = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["all-animals-filter", searchParams],
		queryFn: async (): Promise<FetchResult> => {
			return fetchData(searchParams);
		},
	});

	return queryClient;
};

export const queryGetAllAnimalsFilterInvalidate = ({ searchParams }: Props) => {
	const queryClient = new QueryClient();
	queryClient.invalidateQueries({ queryKey: ["all-animals-filter", searchParams] });
};
