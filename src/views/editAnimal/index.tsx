"use server";

// features
import EditAnimalForm from "@/features/animal/editAnimal/ui/editAnimalForm";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetEditAnimalFilter } from "@/features/animal/editAnimal/model/query/fetchEditAnimalFilters";
// mongoose
import { Types } from "mongoose";

type Props = {
	animalId: Types.ObjectId;
};

const Index = async ({ animalId }: Props) => {
	const queryEditAnimalFIlter = await queryPrefetchGetEditAnimalFilter({ id: animalId });

	return (
		<HydrationBoundary state={dehydrate(queryEditAnimalFIlter)}>
			<EditAnimalForm animalId={animalId} />
		</HydrationBoundary>
	);
};

export default Index;
