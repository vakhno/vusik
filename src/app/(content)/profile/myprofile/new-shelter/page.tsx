"use server";

// features
import NewShelter from "@/views/newShelter";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/entities/profile/model/query/profileByProfileId";
// utils
import { getCookiesId } from "@/utils/cookies";

const page = async () => {
	const id = getCookiesId();
	if (id) {
		// to prefetch user profile
		const queryClient = await queryPrefetchProfile({ userId: id });

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<NewShelter />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
