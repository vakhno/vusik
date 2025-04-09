"use server";

// features
import NewAnimal from "@/screens/newAnimal";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// queries
import { prefetchQuery_getProfile } from "@/entities/profile/model/query/profileByProfileId";
// features
import { queryPrefetchGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
// utils
import { getCookiesId } from "@/shared/utils/cookies";

const page = async () => {
	const userId = getCookiesId();

	if (userId) {
		const queryClient = new QueryClient();

		await Promise.all([prefetchQuery_getProfile({ userId, queryClient }), queryPrefetchGetProfileShelters({ searchParams: {}, userId, queryClient })]);

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<NewAnimal userId={userId} />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
