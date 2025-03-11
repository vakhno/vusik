"use server";

// features
import Profile from "@/views/profile";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// entities
import { queryPrefetchProfile } from "@/entities/profile/model/query/profileByProfileId";
// features
import { queryPrefetchGetProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import { queryPrefetchGetProfileAnimalsFilter } from "@/features/animal/loadProfileAnimalsFilters/model/query/fetchProfileAnimalsFilters";
import { queryPrefetchGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import { queryPrefetchGetProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";
import { queryPrefetchGetProfileArticles } from "@/features/article/loadProfileArticles/model/query/fetchProfileArticles";
import { queryPrefetchGetProfileArticlesFilter } from "@/features/article/loadProfileArticlesFilters/model/query/fetchProfileArticlesFilters";
// mongoose
import { Types } from "mongoose";

type Props = {
	params: { userId: Types.ObjectId };
	// searchParams: SearchParamsType;
};

const page = async ({ params }: Props) => {
	const { userId } = params;
	const searchParams = {};
	if (userId) {
		// to prefetch user profile
		const queryClient = await queryPrefetchProfile({ userId: userId });
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimals = await queryPrefetchGetProfileAnimals({ searchParams: searchParams, id: userId });
		// to prefetch animals filter options with passed searchParams
		const queryAnimalsOptions = await queryPrefetchGetProfileAnimalsFilter({
			searchParams: searchParams,
			id: userId,
		});
		// to prefetch shelters on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryShelters = await queryPrefetchGetProfileShelters({ searchParams: searchParams, id: userId });
		// to prefetch shelters filter options with passed searchParams
		const querySheltersOptions = await queryPrefetchGetProfileSheltersFilter({
			searchParams: searchParams,
			id: userId,
		});
		// to prefetch articles on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryArticles = await queryPrefetchGetProfileArticles({ searchParams: searchParams, id: userId });
		// to prefetch articles filter options with passed searchParams
		const queryArticlesOptions = await queryPrefetchGetProfileArticlesFilter({
			searchParams: searchParams,
			id: userId,
		});
		return (
			<HydrationBoundary state={dehydrate(queryAnimals)}>
				<HydrationBoundary state={dehydrate(queryAnimalsOptions)}>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<HydrationBoundary state={dehydrate(queryShelters)}>
							<HydrationBoundary state={dehydrate(querySheltersOptions)}>
								<HydrationBoundary state={dehydrate(queryArticles)}>
									<HydrationBoundary state={dehydrate(queryArticlesOptions)}>
										<Profile userId={userId} searchParams={searchParams} />
									</HydrationBoundary>
								</HydrationBoundary>
							</HydrationBoundary>
						</HydrationBoundary>
					</HydrationBoundary>
				</HydrationBoundary>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default page;
