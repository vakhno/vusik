"use server";

// features
import Profile from "@/views/profile";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/entities/profile/model/query/profileByProfileId";
// mongoose
import { queryPrefetchGetProfileAnimals } from "@/entities/animal/model/query/animalsAllByPageProfile";
import { queryPrefetchGetProfileAnimalsFilter } from "@/entities/animal/model/query/animalsAllByPageProfileFilters";

import { queryPrefetchGetProfileShelters } from "@/entities/shelter/model/query/sheltersAllByPageProfile";
import { queryPrefetchGetProfileSheltersFilter } from "@/entities/shelter/model/query/sheltersAllByPageProfileFilters";

import { queryPrefetchGetProfileArticles } from "@/entities/article/model/query/articlesAllByPageProfile";
import { queryPrefetchGetProfileArticlesFilter } from "@/entities/article/model/query/articlesAllByPageProfileFilters";
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
