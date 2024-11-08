"use server";

// features
import Profile from "@/features/profile";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/queries/profile.query";
// utils
import { getCookiesId } from "@/utils/cookies";
import { queryPrefetchGetProfileAnimals } from "@/queries/getProfileAnimals";
import { queryPrefetchGetProfileAnimalsFilter } from "@/queries/getProfileAnimalsFilter";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

const page = async ({ searchParams }: Props) => {
	const id = getCookiesId();

	if (id) {
		// to prefetch user profile
		const queryClient = await queryPrefetchProfile({ userId: id });
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimals = await queryPrefetchGetProfileAnimals({ searchParams: searchParams, id: id });
		// to prefetch filter options with passed searchParams
		const queryOptions = await queryPrefetchGetProfileAnimalsFilter({ searchParams: searchParams, id: id });

		return (
			<HydrationBoundary state={dehydrate(queryAnimals)}>
				<HydrationBoundary state={dehydrate(queryOptions)}>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<Profile userId={id} isEditable searchParams={searchParams} />
					</HydrationBoundary>
				</HydrationBoundary>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
