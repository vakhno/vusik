"use server";

// types
import { SearchParamsType } from "@/types/searchParams.type";
// features
import ShelterList from "@/features/shelter/loadAllShelters/ui/sheltersList";
import Filters from "@/features/shelter/loadAllSheltersFilters/ui/sheltersFiltersForm";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllShelters } from "@/features/shelter/loadAllShelters/model/query/fetchAllShelters";
import { queryPrefetchGetAllSheltersFilter } from "@/features/shelter/loadAllSheltersFilters/model/query/fetchAllSheltersFilters";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const [queryShelters, queryFilters] = await Promise.all([
		queryPrefetchGetAllShelters({ searchParams: searchParams }),
		queryPrefetchGetAllSheltersFilter({ searchParams: searchParams }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryShelters)}>
			<HydrationBoundary state={dehydrate(queryFilters)}>
				<Filters searchParams={searchParams} />
				<ShelterList shelterSearchParams={searchParams} />
			</HydrationBoundary>
		</HydrationBoundary>
	);
};

export default Index;
