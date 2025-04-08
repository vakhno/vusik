"use client";

// react
import { useEffect, useState } from "react";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import { cn } from "@/shared/lib/utils";
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import convertObjectToSearchParams from "@/shared/utils/convertObjectToSearchParams";
// features
import selectedFiltersType from "@/features/animal/filterAllAnimals/model/type/selectedFiltersType";
import availableFiltersType from "@/features/animal/filterAllAnimals/model/type/availableFiltersType";
import SearchAllAnimalsFiltersFormSchemaType from "@/features/animal/filterAllAnimals/model/type/filtersFormSchemaType";
import FiltersFields from "@/features/animal/filterAllAnimals/ui/animalsFiltersForm/fields";
import { query_getAllAnimalsFilter } from "@/features/animal/filterAllAnimals/model/query/fetchAllAnimalsFilters";
// entities
import generateShelterMarkers from "@/entities/shelter/model/utils/generateGoogleMapShelterMarkers";

type Props = {
	className?: string;
	searchParams: SearchParamsType;
};

const generateVisibleOptions = (availableOptions: availableFiltersType, selectedOptions: selectedFiltersType) => {
	const filteredOptions = {
		species: availableOptions.species,
		state: availableOptions.state,
		breed: {},
		sex: {},
		size: {},
		city: {},
	} as availableFiltersType;

	if (selectedOptions?.species?.length) {
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

	if (selectedOptions?.state?.length) {
		selectedOptions.state.forEach((state) => {
			if (availableOptions.city[state]) {
				filteredOptions.city[state] = availableOptions.city[state];
			}
		});
	}

	return filteredOptions;
};

const Index = ({ className = "", searchParams }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const [filters, setFilters] = useState(searchParams);

	const { data: fetchedData } = query_getAllAnimalsFilter({
		searchParams: filters,
	});

	const [filtersData, setFiltersData] = useState(fetchedData);

	const availableOptions = (filtersData?.availableOptions && filtersData?.selectedOptions && generateVisibleOptions(filtersData.availableOptions, filtersData.selectedOptions)) || {
		species: [],
		state: [],
		breed: {},
		sex: {},
		size: {},
		city: {},
	};

	useEffect(() => {
		if (fetchedData) {
			setFiltersData(fetchedData);
		}
	}, [fetchedData]);

	const selectedOptions = filtersData?.selectedOptions || {};

	const shelterMarkers: MarkerType[] = filtersData?.shelters ? generateShelterMarkers(Object.values(filtersData.shelters)) : [];

	const filterChange = (data: SearchAllAnimalsFiltersFormSchemaType) => {
		const convertedData = convertObjectToSearchParams(data);
		setFilters(convertedData);
	};

	const filterSubmit = (data: SearchAllAnimalsFiltersFormSchemaType) => {
		const urlSearchParams = convertObjectToURLSearchParams(data);
		handleWindowHistoryPush(urlSearchParams);
	};

	return (
		<div className={cn(className)}>
			<FiltersFields availableOptions={availableOptions} selectedValues={selectedOptions} onFilterChange={filterChange} onFilterSubmit={filterSubmit} />
			<GoogleMapProvider>
				<GoogleMap markers={shelterMarkers} />
			</GoogleMapProvider>
		</div>
	);
};

export default Index;
