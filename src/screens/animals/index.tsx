"use server";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import AnimalsList from "@/features/animal/loadAllAnimals/ui/animalsList";
import AnimalsFiltersForm from "@/features/animal/filterAllAnimals/ui/animalsFiltersForm";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllAnimals } from "@/features/animal/loadAllAnimals/model/query/getAllAnimals";
import { queryPrefetchGetAllAnimalsFilter } from "@/features/animal/filterAllAnimals/model/query/fetchAllAnimalsFilters";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const queryClient = new QueryClient();

	await Promise.all([
		queryPrefetchGetAllAnimals({ searchParams, queryClient }),
		queryPrefetchGetAllAnimalsFilter({ searchParams, queryClient }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AnimalsFiltersForm searchParams={searchParams} />
			<AnimalsList searchParams={searchParams} />
		</HydrationBoundary>
	);
};

export default Index;
