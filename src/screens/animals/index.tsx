"use server";

// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// features
import { prefetchInfiniteQuery_getAllAnimals } from "@/features/animal/loadAllAnimals/model/query/getAllAnimals";
import { prefetchQuery_getAllAnimalsFilter } from "@/features/animal/filterAllAnimals/model/query/fetchAllAnimalsFilters";
import AnimalsList from "@/features/animal/loadAllAnimals/ui/animalsList";
import AnimalsFiltersForm from "@/features/animal/filterAllAnimals/ui/animalsFiltersForm";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await Promise.all([prefetchInfiniteQuery_getAllAnimals({ searchParams, queryClient }), prefetchQuery_getAllAnimalsFilter({ searchParams, queryClient })]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AnimalsFiltersForm searchParams={searchParams} />
			<AnimalsList searchParams={searchParams} />
		</HydrationBoundary>
	);
};

export default Index;
