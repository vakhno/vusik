"use server";

// screen
import Profile from "@/screens/profile";
// tanstack
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
// entities
import { prefetchQuery_getProfile } from "@/entities/profile/model/query/profileByProfileId";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
// features
import { queryPrefetchGetProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import { queryPrefetchGetProfileAnimalsFilter } from "@/features/animal/loadProfileAnimalsFilters/model/query/fetchProfileAnimalsFilters";
import { queryPrefetchGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import { queryPrefetchGetProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";

type Props = {
	params: { userId: string };
	searchParams: SearchParamsType;
};

const page = async ({ params, searchParams }: Props) => {
	const { userId } = params;

	if (userId) {
		const queryClient = new QueryClient();

		await Promise.all([prefetchQuery_getProfile({ userId, queryClient }), queryPrefetchGetProfileAnimals({ searchParams, userId, queryClient }), queryPrefetchGetProfileAnimalsFilter({ searchParams, userId, queryClient }), queryPrefetchGetProfileShelters({ searchParams, userId, queryClient }), queryPrefetchGetProfileSheltersFilter({ searchParams, userId, queryClient })]);

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Profile userId={userId} searchParams={searchParams} />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
