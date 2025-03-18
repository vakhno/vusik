"use client";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import FiltersForm from "@/features/shelter/loadProfileSheltersFilters/ui/sheltersFiltersForm/fullForm";
import selectedFiltersType from "@/features/shelter/loadProfileSheltersFilters/model/type/selectedFiltersType";
import availableFiltersType from "@/features/shelter/loadProfileSheltersFilters/model/type/availableFiltersType";
import { queryGetProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/shelter/loadProfileSheltersFilters/model/type/filtersFormSchemaType";
// widgets
import { MarkerCoordinates } from "@/widget/googleMap/map";
// hooks
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
// mongoose
import { Types } from "mongoose";
// utils
import { urlSearchParamsBuilder } from "@/shared/utils/searchParams";

type Props = {
	searchParams: SearchParamsType;
	id: Types.ObjectId;
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

const Index = ({ searchParams, id }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const { data: fetchedFilters } = queryGetProfileSheltersFilter({
		searchParams: searchParams,
		id: id,
	});
	const availableOptions = (fetchedFilters?.availableOptions &&
		fetchedFilters?.selectedOptions &&
		generateVisibleOptions(fetchedFilters?.availableOptions, fetchedFilters?.selectedOptions)) || {
		state: [],
		city: {},
		sheltersList: {},
	};
	const selectedOptions = fetchedFilters?.selectedOptions || {};
	const shelterMarkers =
		(fetchedFilters?.availableOptions?.sheltersList &&
			generatehelterMarkers(fetchedFilters?.availableOptions?.sheltersList)) ||
		[];

	const filterChange = (data: SearchAllAnimalsFiltersFormSchemaType) => {
		const urlSearchParams = urlSearchParamsBuilder(data);
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
