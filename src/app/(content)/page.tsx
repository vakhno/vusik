"use server";
// features
import Main from "@/features/main";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetAllAnimals } from "@/queries/getAllAnimals.query";
import { queryPrefetchGetAllAnimalsFilter } from "@/queries/getAllAnimalsFilter.query";
// types
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	searchParams: SearchParamsType;
};

const Page = async ({ searchParams }: Props) => {
	// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
	const queryAnimals = await queryPrefetchGetAllAnimals({ searchParams: searchParams });
	// to prefetch filter options with passed searchParams
	const queryOptions = await queryPrefetchGetAllAnimalsFilter({ searchParams: searchParams });

	return (
		<HydrationBoundary state={dehydrate(queryAnimals)}>
			<HydrationBoundary state={dehydrate(queryOptions)}>
				<Main searchParams={searchParams} />
			</HydrationBoundary>
		</HydrationBoundary>
	);
};

export default Page;
