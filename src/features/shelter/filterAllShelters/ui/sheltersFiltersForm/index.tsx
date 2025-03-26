"use client";

// react
import { useEffect, useState } from "react";
// features
import FiltersFields from "@/features/shelter/filterAllShelters/ui/sheltersFiltersForm/fields";
import selectedFiltersType from "@/features/shelter/filterAllShelters/model/type/selectedFiltersType";
import availableFiltersType from "@/features/shelter/filterAllShelters/model/type/availableFiltersType";
import { queryGetAllSheltersFilter } from "@/features/shelter/filterAllShelters/model/query/fetchAllSheltersFilters";
import SearchAllSheltersFiltersFormSchemaType from "@/features/shelter/filterAllShelters/model/type/filtersFormSchemaType";
// entities
import { queryGetAllSheltersInvalidate } from "@/entities/shelter/model/query/loadAllShelters/getAllShelters";
// shared
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import convertObjectToSearchParams from "@/shared/utils/convertObjectToSearchParams";
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { cn } from "@/shared/lib/utils";
import { MarkerCoordinates } from "@/shared/shared/GoogleMap";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
// tanstack
import { useQueryClient } from "@tanstack/react-query";

type Props = {
	className?: string;
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

const Index = ({ className = "", searchParams }: Props) => {
	const queryClient = useQueryClient();
	const handleWindowHistoryPush = useWindowHistoryPush();
	const [filters, setFilters] = useState(searchParams);

	const { data: fetchedData } = queryGetAllSheltersFilter({
		searchParams: filters,
	});
	const [filtersData, setFiltersData] = useState(fetchedData);

	const availableOptions = (filtersData?.availableOptions &&
		filtersData?.selectedOptions &&
		generateVisibleOptions(filtersData?.availableOptions, filtersData?.selectedOptions)) || {
		state: [],
		city: {},
	};

	useEffect(() => {
		if (fetchedData) {
			setFiltersData(fetchedData);
		}
	}, [fetchedData]);

	const selectedOptions = filtersData?.selectedOptions || {};

	const shelterMarkers: MarkerType[] =
		(filtersData?.availableOptions?.sheltersList &&
			generatehelterMarkers(filtersData?.availableOptions?.sheltersList)) ||
		[];

	const filterChange = (data: SearchAllSheltersFiltersFormSchemaType) => {
		const convertedData = convertObjectToSearchParams(data);
		setFilters(convertedData);
	};

	const filterSubmit = (data: SearchAllSheltersFiltersFormSchemaType) => {
		const urlSearchParams = convertObjectToURLSearchParams(data);
		handleWindowHistoryPush(urlSearchParams);

		queryGetAllSheltersInvalidate({ queryClient, searchParams });
	};

	return (
		<div className={cn(className)}>
			<FiltersFields
				availableOptions={availableOptions}
				selectedValues={selectedOptions}
				onFilterChange={filterChange}
				onFilterSubmit={filterSubmit}
			/>
			<GoogleMapProvider>
				<GoogleMap markers={shelterMarkers} />
			</GoogleMapProvider>
		</div>
	);
};

export default Index;
