"use server";

// features
import Profile from "@/screens/profile";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchProfile } from "@/entities/profile/model/query/profileByProfileId";
// utils
import { getCookiesId } from "@/shared/utils/cookies";
// features
import { queryPrefetchGetProfileAnimals } from "@/features/animal/loadProfileAnimals/model/query/fetchProfileAnimals";
import { queryPrefetchGetProfileAnimalsFilter } from "@/features/animal/loadProfileAnimalsFilters/model/query/fetchProfileAnimalsFilters";
import { queryPrefetchGetProfileShelters } from "@/features/shelter/loadProfileShelters/model/query/fetchProfileShelters";
import { queryPrefetchGetProfileSheltersFilter } from "@/features/shelter/loadProfileSheltersFilters/model/query/fetchProfileSheltersFilters";
import { queryPrefetchGetProfileArticles } from "@/features/article/loadProfileArticles/model/query/fetchProfileArticles";
import { queryPrefetchGetProfileArticlesFilter } from "@/features/article/loadProfileArticlesFilters/model/query/fetchProfileArticlesFilters";
// types
import { SearchParamsType } from "@/shared/types/searchParams.type";

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
