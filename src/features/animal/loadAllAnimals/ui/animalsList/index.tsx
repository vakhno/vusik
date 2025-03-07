"use client";

// features
import { queryGetAllAnimals } from "@/features/animal/loadAllAnimals/model/query/getAllAnimals";
import List from "@/features/animal/loadAllAnimals/ui/animalsList/list";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// constants
import { animalsPerPage } from "@/constants/counts";

type Props = { animalSearchParams: SearchParamsType };

const Index = ({ animalSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedAnimals,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetAllAnimals({ searchParams: animalSearchParams });

	const animals = fetchedAnimals?.pages.flatMap((page) => page?.animals || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<List
			animals={animals}
			isLoading={isLoading}
			isPending={isPending}
			isFetchingNextPage={isFetchingNextPage}
			isHasNextPage={hasNextPage}
			countPerPage={animalsPerPage}
			onNewPageUpload={handleNewPageUpload}
		/>
	);
};

export default Index;
