"use server";

// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import AnimalsList from "@/features/animal/loadAllAnimals/ui/animalsList";
import AnimalsFiltersForm from "@/features/animal/filterAllAnimals/ui/animalsFiltersForm";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllAnimals } from "@/features/animal/loadAllAnimals/model/query/getAllAnimals";
import { queryPrefetchGetAllAnimalsFilter } from "@/features/animal/filterAllAnimals/model/query/fetchAllAnimalsFilters";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const [queryAnimals, queryFilters] = await Promise.all([
		queryPrefetchGetAllAnimals({ searchParams: searchParams }),
		queryPrefetchGetAllAnimalsFilter({ searchParams: searchParams }),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryAnimals)}>
			<HydrationBoundary state={dehydrate(queryFilters)}>
				<AnimalsFiltersForm searchParams={searchParams} />
				<AnimalsList animalSearchParams={searchParams} />
			</HydrationBoundary>
		</HydrationBoundary>
	);
};

export default Index;
