"use server";

// features
import Profile from "@/views/profile";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/entities/profile/model/query/profileByProfileId";
// utils
import { getCookiesId } from "@/utils/cookies";
import { queryPrefetchGetProfileAnimals } from "@/entities/animal/model/query/animalsAllByPageProfile";
import { queryPrefetchGetProfileAnimalsFilter } from "@/entities/animal/model/query/animalsAllByPageProfileFilters";
import { queryPrefetchGetProfileShelters } from "@/entities/shelter/model/query/sheltersAllByPageProfile";
import { queryPrefetchGetProfileSheltersFilter } from "@/entities/shelter/model/query/sheltersAllByPageProfileFilters";

import { queryPrefetchGetProfileArticles } from "@/entities/article/model/query/articlesAllByPageProfile";
import { queryPrefetchGetProfileArticlesFilter } from "@/entities/article/model/query/articlesAllByPageProfileFilters";
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
		// to prefetch shelters on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryShelters = await queryPrefetchGetProfileShelters({ searchParams: searchParams, id: id });
		// to prefetch shelters filter options with passed searchParams
		const querySheltersOptions = await queryPrefetchGetProfileSheltersFilter({
			searchParams: searchParams,
			id: id,
		});
		// to prefetch articles on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryArticles = await queryPrefetchGetProfileArticles({ searchParams: searchParams, id: id });
		// to prefetch articles filter options with passed searchParams
		const queryArticlesOptions = await queryPrefetchGetProfileArticlesFilter({
			searchParams: searchParams,
			id: id,
		});

		return (
			<HydrationBoundary state={dehydrate(queryAnimals)}>
				<HydrationBoundary state={dehydrate(queryOptions)}>
					<HydrationBoundary state={dehydrate(queryClient)}>
						<HydrationBoundary state={dehydrate(queryShelters)}>
							<HydrationBoundary state={dehydrate(querySheltersOptions)}>
								<HydrationBoundary state={dehydrate(queryArticles)}>
									<HydrationBoundary state={dehydrate(queryArticlesOptions)}>
										<Profile userId={id} isEditable searchParams={searchParams} />
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
