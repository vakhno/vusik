"use client";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import FiltersForm from "@/features/animal/loadProfileAnimalsFilters/ui/animalsFiltersForm/fullForm";
import selectedFiltersType from "@/features/animal/loadProfileAnimalsFilters/model/type/selectedFiltersType";
import availableFiltersType from "@/features/animal/loadProfileAnimalsFilters/model/type/availableFiltersType";
import { query_getProfileAnimalsFilter } from "@/features/animal/loadProfileAnimalsFilters/model/query/fetchProfileAnimalsFilters";
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/animal/loadProfileAnimalsFilters/model/type/filtersFormSchemaType";
// hooks
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
// shared
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import generateShelterMarkers from "@/entities/shelter/model/utils/generateGoogleMapShelterMarkers";

type Props = {
	searchParams: SearchParamsType;
	id: string;
};

const generateVisibleOptions = (availableOptions: Omit<availableFiltersType, "sheltersList">, selectedOptions: selectedFiltersType) => {
	const filteredOptions = {
		species: availableOptions.species,
		state: availableOptions.state,
		breed: {},
		sex: {},
		size: {},
		city: {},
	} as Omit<availableFiltersType, "sheltersList">;

	if (selectedOptions?.species && selectedOptions.species.length) {
		selectedOptions.species.forEach((species) => {
			if (availableOptions.breed[species]) {
				filteredOptions.breed[species] = availableOptions.breed[species];
			}

			if (availableOptions.sex[species]) {
				filteredOptions.sex[species] = availableOptions.sex[species];
			}

			if (availableOptions.size[species]) {
				filteredOptions.size[species] = availableOptions.size[species];
			}
		});
	}

	if (selectedOptions?.state && selectedOptions.state.length) {
		selectedOptions.state.forEach((state) => {
			if (availableOptions.city[state]) {
				filteredOptions.city[state] = availableOptions.city[state];
			}
		});
	}

	return filteredOptions;
};

const Index = ({ searchParams, id }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const { data: fetchedFilters } = query_getProfileAnimalsFilter({
		searchParams: searchParams,
		userId: id,
	});
	const availableOptions = (fetchedFilters?.availableOptions && fetchedFilters?.selectedOptions && generateVisibleOptions(fetchedFilters?.availableOptions, fetchedFilters?.selectedOptions)) || {
		species: [],
		state: [],
		breed: {},
		sex: {},
		size: {},
		city: {},
		sheltersList: {},
	};
	const selectedOptions = fetchedFilters?.selectedOptions || {};
	const shelterMarkers: MarkerType[] = fetchedFilters?.shelters ? generateShelterMarkers(fetchedFilters?.shelters) : [];

	const filterChange = (data: SearchAllAnimalsFiltersFormSchemaType) => {
		const urlSearchParams = convertObjectToURLSearchParams(data);
		handleWindowHistoryPush(urlSearchParams);
	};

	return (
		<>
			<FiltersForm availableOptions={availableOptions} selectedValues={selectedOptions} handleFilterChange={filterChange} />
			<GoogleMapProvider>
				<GoogleMap markers={shelterMarkers} />
			</GoogleMapProvider>
		</>
	);
};

export default Index;
