// features
import EditShelter from "@/screens/editShelter";
// tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// entities
import { prefetchQuery_getShelter } from "@/entities/shelter/model/query/shelterById";

type Props = {
	params: { shelterId: string };
};

const Page = async ({ params }: Props) => {
	const { shelterId } = params;
	if (shelterId) {
		const queryClient = new QueryClient();
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimal = await prefetchQuery_getShelter({ shelterId, queryClient });
		// const queryClient = await queryPrefetchProfile({ userId: id });
		return (
			<HydrationBoundary state={dehydrate(queryAnimal)}>
				<div className="w-full">
					<EditShelter shelterId={shelterId} />
				</div>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Page;
