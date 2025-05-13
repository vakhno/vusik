"use server";

//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// entities
import { prefetchQuery_getShelterById } from "@/entities/shelter/model/query/shelterById";
import ShelterProfile from "@/entities/shelter/ui/shelterProfile";

type Props = {
	shelterId: string;
};

const Index = async ({ shelterId }: Props) => {
	if (shelterId) {
		const queryClient = new QueryClient();

		await prefetchQuery_getShelterById({ shelterId, queryClient });

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ShelterProfile shelterId={shelterId} />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Index;
