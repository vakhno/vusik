"use server";

// features
import Profile from "@/features/profile";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/queries/profile.query";
// mongoose
import { queryPrefetchGetProfileAnimals } from "@/queries/getProfileAnimals";
import { queryPrefetchGetProfileAnimalsFilter } from "@/queries/getProfileAnimalsFilter";
// mongoose
import { Types } from "mongoose";

type Props = {
	params: { userId: Types.ObjectId };
	searchParams: Record<string, string | string[]>;
};

const page = async ({ params, searchParams }: Props) => {
	const { userId } = params;

	if (userId) {
		// to prefetch user profile
		const queryClient = await queryPrefetchProfile({ userId: userId });
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimals = await queryPrefetchGetProfileAnimals({ searchParams: searchParams, id: userId });
		// to prefetch filter options with passed searchParams
		const queryOptions = await queryPrefetchGetProfileAnimalsFilter({ searchParams: searchParams, id: userId });

		return (
			<HydrationBoundary state={dehydrate(queryAnimals)}>
				<HydrationBoundary state={dehydrate(queryOptions)}>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<Profile userId={userId} searchParams={searchParams} />
					</HydrationBoundary>
				</HydrationBoundary>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
