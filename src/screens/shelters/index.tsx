"use server";

// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import ShelterList from "@/features/shelter/loadAllShelters/ui/sheltersList";
import Filters from "@/features/shelter/filterAllShelters/ui/sheltersFiltersForm";
import { prefetchInfiniteQuery_getAllShelters } from "@/features/shelter/loadAllShelters/model/query/fetchAllShelters";
import { prefetchQuery_getAllSheltersFilter } from "@/features/shelter/filterAllShelters/model/query/fetchAllSheltersFilters";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await Promise.all([prefetchInfiniteQuery_getAllShelters({ searchParams, queryClient }), prefetchQuery_getAllSheltersFilter({ searchParams, queryClient })]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Filters searchParams={searchParams} />
			<ShelterList searchParams={searchParams} />
		</HydrationBoundary>
	);
};

export default Index;
