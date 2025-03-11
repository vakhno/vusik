"use server";

// features
import NewAnimal from "@/views/newAnimal";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/entities/profile/model/query/profileByProfileId";
// features
import { queryPrefetchGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
// utils
import { getCookiesId } from "@/utils/cookies";

const page = async () => {
	const id = getCookiesId();
	if (id) {
		// to prefetch user profile
		const queryClient = await queryPrefetchProfile({ userId: id });
		// to prefetch shelters on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryShelters = await queryPrefetchGetProfileShelters({ searchParams: {}, id: id });
		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<HydrationBoundary state={dehydrate(queryShelters)}>
					<NewAnimal userId={id} />
				</HydrationBoundary>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
