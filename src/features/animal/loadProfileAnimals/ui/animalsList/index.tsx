"use client";

// features
import { queryGetProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import AnimalsList from "@/features/animal/loadProfileAnimals/ui/animalsList/list";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// constants
import { ANIMALS_PER_PAGE } from "@/shared/constants/counts";

type Props = { isEditable?: boolean; userId: string; animalSearchParams: SearchParamsType };

const Index = ({ isEditable = false, userId, animalSearchParams }: Props) => {
	const { fetchNextPage, data: fetchedAnimals, isLoading, isPending, hasNextPage, isFetchingNextPage } = queryGetProfileAnimals({ searchParams: animalSearchParams, userId });

	const animals = fetchedAnimals?.pages.flatMap((page) => page?.animals || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return <AnimalsList isEditable={isEditable} animals={animals} isLoading={isLoading} isPending={isPending} isFetchingNextPage={isFetchingNextPage} isHasNextPage={hasNextPage} countPerPage={ANIMALS_PER_PAGE} onNewPageUpload={handleNewPageUpload} />;
};

export default Index;
