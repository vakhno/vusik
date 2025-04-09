"use server";

// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// features
import { prefetchQuery_getProfile } from "@/entities/profile/model/query/profileByProfileId";
import { queryPrefetchGetProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import { queryPrefetchGetProfileAnimalsFilter } from "@/features/animal/loadProfileAnimalsFilters/model/query/fetchProfileAnimalsFilters";
import { queryPrefetchGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import { queryPrefetchGetProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";
// widgets
import Profile from "@/widget/fullProfile";

type Props = {
	userId: string;
	searchParams: SearchParamsType;
	isEditable?: boolean;
};

const Index = async ({ userId, searchParams, isEditable = false }: Props) => {
	const queryClient = new QueryClient();

	await Promise.all([prefetchQuery_getProfile({ userId, queryClient }), queryPrefetchGetProfileAnimals({ searchParams, userId, queryClient }), queryPrefetchGetProfileAnimalsFilter({ searchParams, userId, queryClient }), queryPrefetchGetProfileShelters({ searchParams, userId, queryClient }), queryPrefetchGetProfileSheltersFilter({ searchParams, userId, queryClient })]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Profile userId={userId} isEditable={isEditable} searchParams={searchParams} />
		</HydrationBoundary>
	);
};

export default Index;
