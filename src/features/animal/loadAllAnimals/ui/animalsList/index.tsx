"use client";

// features
import { infiniteQuery_getAllAnimals } from "@/features/animal/loadAllAnimals/model/query/getAllAnimals";
import List from "@/features/animal/loadAllAnimals/ui/animalsList/list";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { animalsPerPage } from "@/shared/constants/counts";
import { cn } from "@/shared/lib/utils";

type Props = {
	className?: string;
	searchParams: SearchParamsType;
};

const Index = ({ className = "", searchParams }: Props) => {
	const { fetchNextPage, data: fetchedAnimals, isLoading, isPending, hasNextPage, isFetchingNextPage, isRefetching } = infiniteQuery_getAllAnimals({ searchParams: searchParams });
	const animals = fetchedAnimals?.pages.flatMap((page) => page?.animals || []) || [];
	console.log("LOAD");
	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<div className={cn(className)}>
			<List animals={animals} isLoading={isLoading || isRefetching} isPending={isPending} isFetchingNextPage={isFetchingNextPage} isHasNextPage={hasNextPage} countPerPage={animalsPerPage} onNewPageUpload={handleNewPageUpload} />
		</div>
	);
};

export default Index;
