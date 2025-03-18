"use server";

//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchAnimal } from "@/entities/animal/model/query/animalById";
import Animal from "@/entities/animal/ui/animalProfile";
// mongoose
import { Types } from "mongoose";

type Props = {
	animalId: Types.ObjectId;
};

const Index = async ({ animalId }: Props) => {
	const queryAnimal = await queryPrefetchAnimal({ animalId: animalId });

	return (
		<HydrationBoundary state={dehydrate(queryAnimal)}>
			<Animal animalId={animalId} />
		</HydrationBoundary>
	);
};

export default Index;
