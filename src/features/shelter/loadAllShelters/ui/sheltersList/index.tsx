"use client";

// features
import { infiniteQuery_getAllShelters } from "@/features/shelter/loadAllShelters/model/query/fetchAllShelters";
import List from "@/features/shelter/loadAllShelters/ui/sheltersList/list";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { sheltersPerPage } from "@/shared/constants/counts";
import { cn } from "@/shared/lib/utils";

type Props = { className?: string; searchParams: SearchParamsType };

const Index = ({ className = "", searchParams }: Props) => {
	const { fetchNextPage, data: fetchedShelters, isLoading, isPending, hasNextPage, isFetchingNextPage, isRefetching } = infiniteQuery_getAllShelters({ searchParams: searchParams });

	const shelters = fetchedShelters?.pages.flatMap((page) => page?.shelters || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<div className={cn(className)}>
			<List shelters={shelters} isLoading={isLoading || isRefetching} isPending={isPending} isFetchingNextPage={isFetchingNextPage} isHasNextPage={hasNextPage} countPerPage={sheltersPerPage} onNewPageUpload={handleNewPageUpload} />
		</div>
	);
};

export default Index;
