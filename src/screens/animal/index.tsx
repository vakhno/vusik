"use server";

//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// entities
import { prefetchQuery_getAnimalById } from "@/entities/animal/model/query/animalById";
import Animal from "@/entities/animal/ui/animalProfile";

type Props = {
	animalId: string;
};

const Index = async ({ animalId }: Props) => {
	const queryClient = new QueryClient();

	await prefetchQuery_getAnimalById({ animalId, queryClient });

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Animal animalId={animalId} />
		</HydrationBoundary>
	);
};

export default Index;
