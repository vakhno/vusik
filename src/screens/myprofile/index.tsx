"use server";

// screen
import ProfileScreen from "@/widget/fullProfile";
// tanstack
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
// entities
import { prefetchQuery_getProfile } from "@/entities/profile/model/query/profileByProfileId";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { getCookiesId } from "@/shared/utils/cookies";
// features
import { prefetchQuery_getProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import { prefetchQuery_getProfileAnimalsFilter } from "@/features/animal/loadProfileAnimalsFilters/model/query/fetchProfileAnimalsFilters";
import { prefetchQuery_getProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import { prefetchQuery_getProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";

type Props = {
	searchParams: SearchParamsType;
};

const Index = async ({ searchParams }: Props) => {
	const userId = getCookiesId();

	if (userId) {
		const queryClient = new QueryClient();

		await Promise.all([prefetchQuery_getProfile({ userId, queryClient }), prefetchQuery_getProfileAnimals({ searchParams, userId, queryClient }), prefetchQuery_getProfileAnimalsFilter({ searchParams, userId, queryClient }), prefetchQuery_getProfileShelters({ searchParams, userId, queryClient }), prefetchQuery_getProfileSheltersFilter({ searchParams, userId, queryClient })]);

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ProfileScreen userId={userId} searchParams={searchParams} isEditable />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Index;
