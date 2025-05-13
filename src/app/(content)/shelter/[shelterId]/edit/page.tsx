// features
import EditShelter from "@/screens/editShelter";
// tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// entities
import { prefetchQuery_getShelterById } from "@/entities/shelter/model/query/shelterById";

type Props = {
	params: { shelterId: string };
};

const Page = async ({ params }: Props) => {
	const { shelterId } = params;
	if (shelterId) {
		const queryClient = new QueryClient();
		const queryAnimal = await prefetchQuery_getShelterById({ shelterId, queryClient });

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
