"use client";

// features
import { queryGetAllShelters } from "@/features/shelter/loadAllShelters/model/query/fetchAllShelters";
import SheltersList from "@/features/shelter/loadAllShelters/ui/sheltersList/list";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// constants
import { sheltersPerPage } from "@/shared/constants/counts";

type Props = { shelterSearchParams: SearchParamsType };

const Index = ({ shelterSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedShelters,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetAllShelters({ searchParams: shelterSearchParams });

	const shelters = fetchedShelters?.pages.flatMap((page) => page?.shelters || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<SheltersList
			shelters={shelters}
			isLoading={isLoading}
			isPending={isPending}
			isFetchingNextPage={isFetchingNextPage}
			isHasNextPage={hasNextPage}
			countPerPage={sheltersPerPage}
			onNewPageUpload={handleNewPageUpload}
		/>
	);
};

export default Index;
