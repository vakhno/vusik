// features
import EditAnimal from "@/screens/editAnimal";
// tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// entities
import { prefetchQuery_getAnimalById } from "@/entities/animal/model/query/animalById";

type Props = {
	params: { animalId: string };
};

const Page = async ({ params }: Props) => {
	const { animalId } = params;
	if (animalId) {
		const queryClient = new QueryClient();

		await prefetchQuery_getAnimalById({ animalId: animalId, queryClient });

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<div className="w-full">
					<EditAnimal animalId={animalId} />
				</div>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Page;
