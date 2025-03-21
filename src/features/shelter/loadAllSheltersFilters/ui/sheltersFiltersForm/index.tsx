"use client";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import FiltersForm from "@/features/shelter/loadAllSheltersFilters/ui/sheltersFiltersForm/fullForm";
import selectedFiltersType from "@/features/shelter/loadAllSheltersFilters/model/type/selectedFiltersType";
import availableFiltersType from "@/features/shelter/loadAllSheltersFilters/model/type/availableFiltersType";
import { queryGetAllSheltersFilter } from "@/features/shelter/loadAllSheltersFilters/model/query/fetchAllSheltersFilters";
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/shelter/loadAllSheltersFilters/model/type/filtersFormSchemaType";
// widgets
import { MarkerCoordinates } from "@/shared/shared/GoogleMap";
// hooks
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";

type Props = {
	searchParams: SearchParamsType;
};

const generatehelterMarkers = (sheltersList: Record<string, { name: string; coordinates: MarkerCoordinates }>) => {
	const availableShelterMarkers = Object.values(sheltersList).map((shelter) => shelter.coordinates);
	return availableShelterMarkers;
};

const generateVisibleOptions = (
	availableOptions: Omit<availableFiltersType, "sheltersList">,
	selectedOptions: selectedFiltersType,
) => {
	const filteredOptions = {
		state: availableOptions.state,
		city: {},
	} as Omit<availableFiltersType, "sheltersList">;

	if (selectedOptions?.state && selectedOptions.state.length) {
		selectedOptions.state.forEach((state) => {
			if (availableOptions.city[state]) {
				filteredOptions.city[state] = availableOptions.city[state];
			}
		});
	}

	return filteredOptions;
};

const Index = ({ searchParams }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const { data: fetchedFilters } = queryGetAllSheltersFilter({
		searchParams: searchParams,
	});
	const availableOptions = (fetchedFilters?.availableOptions &&
		fetchedFilters?.selectedOptions &&
		generateVisibleOptions(fetchedFilters?.availableOptions, fetchedFilters?.selectedOptions)) || {
		state: [],
		city: {},
	};
	const selectedOptions = fetchedFilters?.selectedOptions || {};
	const shelterMarkers =
		(fetchedFilters?.availableOptions?.sheltersList &&
			generatehelterMarkers(fetchedFilters?.availableOptions?.sheltersList)) ||
		[];

	const filterChange = (data: SearchAllAnimalsFiltersFormSchemaType) => {
		const urlSearchParams = convertObjectToURLSearchParams(data);
		handleWindowHistoryPush(urlSearchParams);
	};

	return (
		<FiltersForm
			availableOptions={availableOptions}
			selectedValues={selectedOptions}
			shelterMarkers={shelterMarkers}
			handleFilterChange={filterChange}
		/>
	);
};

export default Index;
