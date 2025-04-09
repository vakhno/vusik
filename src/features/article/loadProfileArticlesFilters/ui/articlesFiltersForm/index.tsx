"use client";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import FiltersForm from "@/features/article/loadProfileArticlesFilters/ui/articlesFiltersForm/fullForm";
import availableFiltersType from "@/features/article/loadAllArticlesFilters/model/type/availableFiltersType";
import { queryGetProfileArticlesFilter } from "@/features/article/loadProfileArticlesFilters/model/query/fetchProfileArticlesFilters";
import { SearchAllArticlesFiltersFormSchemaType } from "@/features/article/loadProfileArticlesFilters/model/type/filtersFormSchemaType";
// hooks
import { useWindowHistoryPush } from "@/shared/hooks/use-window-history-push";
// utils
import convertObjectToURLSearchParams from "@/shared/utils/convertObjectToURLSearchParams";

type Props = {
	searchParams: SearchParamsType;
	id: string;
};

const generateVisibleOptions = (availableOptions: availableFiltersType) => {
	const filteredOptions = {
		category: availableOptions.category,
	} as availableFiltersType;

	return filteredOptions;
};

const Index = ({ searchParams, id }: Props) => {
	const handleWindowHistoryPush = useWindowHistoryPush();
	const { data: fetchedFilters } = queryGetProfileArticlesFilter({
		searchParams: searchParams,
		userId: id,
	});
	const availableOptions = (fetchedFilters?.availableOptions &&
		fetchedFilters?.selectedOptions &&
		generateVisibleOptions(fetchedFilters?.availableOptions)) || {
		category: [],
	};
	const selectedOptions = fetchedFilters?.selectedOptions || {};

	const filterChange = (data: SearchAllArticlesFiltersFormSchemaType) => {
		const urlSearchParams = convertObjectToURLSearchParams(data);
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
