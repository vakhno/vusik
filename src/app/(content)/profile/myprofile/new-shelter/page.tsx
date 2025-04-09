"use server";

// features
import NewShelter from "@/screens/newShelter";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// queries
import { prefetchQuery_getProfile } from "@/entities/profile/model/query/profileByProfileId";
// utils
import { getCookiesId } from "@/shared/utils/cookies";

const page = async () => {
	const userId = getCookiesId();

	if (userId) {
		const queryClient = new QueryClient();

		await prefetchQuery_getProfile({ userId, queryClient });

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
