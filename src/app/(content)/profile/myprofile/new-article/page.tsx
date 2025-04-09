"use server";

// features
import NewArticle from "@/screens/newArticle";
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
				<NewArticle />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
