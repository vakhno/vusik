"use client";

// features
import { queryGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import SheltersList from "@/features/shelter/loadProfileShelters/ui/sheltersList/list";
// types
import { SearchParamsType } from "@/types/searchParams.type";
// mongoose
import { Types } from "mongoose";
// constants
import { sheltersPerPage } from "@/constants/counts";

type Props = { isEditable?: boolean; id: Types.ObjectId; shelterSearchParams: SearchParamsType };

const Index = ({ isEditable = false, id, shelterSearchParams }: Props) => {
	const {
		fetchNextPage,
		data: fetchedShelters,
		isLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetProfileShelters({ id, searchParams: shelterSearchParams });

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
