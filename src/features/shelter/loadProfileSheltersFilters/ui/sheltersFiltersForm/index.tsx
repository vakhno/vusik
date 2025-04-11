"use client";

// react
import { useEffect, useState } from "react";
// features
import FiltersFields from "@/features/shelter/loadProfileSheltersFilters/ui/sheltersFiltersForm/fields";
import selectedFiltersType from "@/features/shelter/filterAllShelters/model/type/selectedFiltersType";
import availableFiltersType from "@/features/shelter/filterAllShelters/model/type/availableFiltersType";
import { query_getProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";
import SearchAllSheltersFiltersFormSchemaType from "@/features/shelter/filterAllShelters/model/type/filtersFormSchemaType";
// entities
import generateShelterMarkers from "@/entities/shelter/model/utils/generateGoogleMapShelterMarkers";
// shared
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import convertObjectToSearchParams from "@/shared/utils/convertObjectToSearchParams";
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";
import { cn } from "@/shared/lib/utils";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";

type Props = {
	className?: string;
	userId: string;
	searchParams: SearchParamsType;
};

const generateVisibleOptions = (availableOptions: Omit<availableFiltersType, "sheltersList">, selectedOptions: selectedFiltersType) => {
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

const Index = ({ className = "", userId, searchParams }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const [filters, setFilters] = useState(searchParams);

	const { data: fetchedData } = query_getProfileSheltersFilter({
		userId: userId,
		searchParams: filters,
	});
	const [filtersData, setFiltersData] = useState(fetchedData);

	const availableOptions = (filtersData?.availableOptions && filtersData?.selectedOptions && generateVisibleOptions(filtersData?.availableOptions, filtersData?.selectedOptions)) || {
		state: [],
		city: {},
	};

	useEffect(() => {
		if (fetchedData) {
			setFiltersData(fetchedData);
		}
	}, [fetchedData]);

	const selectedOptions = filtersData?.selectedOptions || {};

	const shelterMarkers: MarkerType[] = filtersData?.shelters ? generateShelterMarkers(Object.values(filtersData.shelters)) : [];

	const filterChange = (data: SearchAllSheltersFiltersFormSchemaType) => {
		const convertedData = convertObjectToSearchParams(data);
		setFilters(convertedData);
	};

	const filterSubmit = (data: SearchAllSheltersFiltersFormSchemaType) => {
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
