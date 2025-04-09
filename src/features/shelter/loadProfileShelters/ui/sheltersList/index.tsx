"use client";

// features
import { queryGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import SheltersList from "@/features/shelter/loadProfileShelters/ui/sheltersList/list";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";
// constants
import { sheltersPerPage } from "@/shared/constants/counts";

type Props = { isEditable?: boolean; id: string; shelterSearchParams: SearchParamsType };

const Index = ({ isEditable = false, id, shelterSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedShelters,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetProfileShelters({ userId: id, searchParams: shelterSearchParams });

	const shelters = fetchedShelters?.pages.flatMap((page) => page?.shelters || []) || [];

	const handleNewPageUpload = () => {
		fetchNextPage();
	};

	return (
		<SheltersList
			isEditable={isEditable}
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
