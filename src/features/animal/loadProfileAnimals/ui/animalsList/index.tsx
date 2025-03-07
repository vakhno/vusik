"use client";

// features
import { queryGetProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import AnimalsList from "@/features/animal/loadProfileAnimals/ui/animalsList/list";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// mongoose
import { Types } from "mongoose";
// constants
import { animalsPerPage } from "@/constants/counts";

type Props = { isEditable?: boolean; userId: Types.ObjectId; animalSearchParams: SearchParamsType };

const Index = ({ isEditable = false, userId, animalSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedAnimals,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetProfileAnimals({ searchParams: animalSearchParams, id: userId });

	const animals = fetchedAnimals?.pages.flatMap((page) => page?.animals || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<AnimalsList
			isEditable={isEditable}
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
