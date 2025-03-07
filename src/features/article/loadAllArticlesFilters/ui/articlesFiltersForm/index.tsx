"use client";

// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import FiltersForm from "@/features/article/loadAllArticlesFilters/ui/articlesFiltersForm/fullForm";
import availableFiltersType from "@/features/article/loadAllArticlesFilters/model/type/availableFiltersType";
import { queryGetAllArticlesFilter } from "@/features/article/loadAllArticlesFilters/model/query/fetchAllArticlesFilters";
import { SearchAllArticlesFiltersFormSchemaType } from "@/features/article/loadAllArticlesFilters/model/type/filtersFormSchemaType";
// hooks
import { useWindowHistoryPush } from "@/hooks/use-window-history-push";
// utils
import { urlSearchParamsBuilder } from "@/utils/searchParams";

type Props = {
	searchParams: SearchParamsType;
};

const generateVisibleOptions = (availableOptions: availableFiltersType) => {
	const filteredOptions = {
		category: availableOptions.category,
	} as availableFiltersType;

	return filteredOptions;
};

const Index = ({ searchParams }: Props) => {
	const { data: fetchedFilters } = queryGetAllArticlesFilter({
		searchParams: searchParams,
	});
	const handleWindowHistoryPush = useWindowHistoryPush();

	const availableOptions = (fetchedFilters?.availableOptions &&
		fetchedFilters?.selectedOptions &&
		generateVisibleOptions(fetchedFilters?.availableOptions)) || {
		species: [],
		state: [],
		breed: {},
		sex: {},
		size: {},
		city: {},
		sheltersList: {},
	};
	const selectedOptions = fetchedFilters?.selectedOptions || {};

	const filterChange = (data: SearchAllArticlesFiltersFormSchemaType) => {
		const urlSearchParams = urlSearchParamsBuilder(data);
		handleWindowHistoryPush(urlSearchParams);
	};

	return (
		<FiltersForm
			availableOptions={availableOptions}
			selectedValues={selectedOptions}
			handleFilterChange={filterChange}
		/>
	);
};

export default Index;
