"use server";

// features
import EditAnimalForm from "@/features/animal/editAnimal/ui/editAnimalForm";
import { prefetchQuery_getEditAnimalFilter } from "@/features/animal/editAnimal/model/query/fetchEditAnimalFilters";
//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

type Props = {
	animalId: string;
};

const Index = async ({ animalId }: Props) => {
	if (animalId) {
		const queryClient = new QueryClient();

		await prefetchQuery_getEditAnimalFilter({ animalId, queryClient });

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<EditAnimalForm animalId={animalId} />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Index;
