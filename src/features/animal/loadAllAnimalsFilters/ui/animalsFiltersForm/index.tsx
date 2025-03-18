"use client";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import FiltersForm from "@/features/animal/loadAllAnimalsFilters/ui/animalsFiltersForm/fullForm";
import selectedFiltersType from "@/features/animal/loadAllAnimalsFilters/model/type/selectedFiltersType";
import availableFiltersType from "@/features/animal/loadAllAnimalsFilters/model/type/availableFiltersType";
import { queryGetAllAnimalsFilter } from "@/features/animal/loadAllAnimalsFilters/model/query/fetchAllAnimalsFilters";
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/animal/loadAllAnimalsFilters/model/type/filtersFormSchemaType";
// widgets
import { MarkerCoordinates } from "@/widget/googleMap/map";
// shared
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
import { urlSearchParamsBuilder } from "@/shared/utils/searchParams";
import { cn } from "@/shared/lib/utils";

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

const Index = ({ className = "", searchParams }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const { data: fetchedFilters } = queryGetAllAnimalsFilter({
		searchParams: searchParams,
	});
	const availableOptions = (fetchedFilters?.availableOptions &&
		fetchedFilters?.selectedOptions &&
		generateVisibleOptions(fetchedFilters?.availableOptions, fetchedFilters?.selectedOptions)) || {
		species: [],
		state: [],
		breed: {},
		sex: {},
		size: {},
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
		<div className={cn(className)}>
			<FiltersForm
				availableOptions={availableOptions}
				selectedValues={selectedOptions}
				shelterMarkers={shelterMarkers}
				handleFilterChange={filterChange}
			/>
		</div>
	);
};

export default Index;
