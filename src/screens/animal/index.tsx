"use server";

//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// queries
import { prefetchQuery_getAnimalById } from "@/entities/animal/model/query/animalById";
import Animal from "@/entities/animal/ui/animalProfile";
// mongoose
import { Types } from "mongoose";

type Props = {
	animalId: Types.ObjectId;
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
