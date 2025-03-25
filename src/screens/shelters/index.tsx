"use server";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import ShelterList from "@/features/shelter/loadAllShelters/ui/sheltersList";
import Filters from "@/features/shelter/loadAllSheltersFilters/ui/sheltersFiltersForm";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllShelters } from "@/features/shelter/loadAllShelters/model/query/fetchAllShelters";
import { queryPrefetchGetAllSheltersFilter } from "@/features/shelter/loadAllSheltersFilters/model/query/fetchAllSheltersFilters";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await Promise.all([
		queryPrefetchGetAllShelters({ searchParams, queryClient }),
		queryPrefetchGetAllSheltersFilter({ searchParams, queryClient }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Filters searchParams={searchParams} />
			<ShelterList searchParams={searchParams} />
		</HydrationBoundary>
	);
};

export default Index;
