"use server";

// features
import NewAnimalForm from "@/features/animal/newAnimal/ui/newAnimalForm/index";
//tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// queries
import { queryPrefetchGetNewAnimalFilter } from "@/features/animal/newAnimal/model/query/fetchNewAnimalFilters";
// mongoose
import { Types } from "mongoose";

type Props = {
	userId: Types.ObjectId;
};

const Index = async ({ userId }: Props) => {
	const queryNewAnimalFIlter = await queryPrefetchGetNewAnimalFilter({ id: userId });

	return (
		<HydrationBoundary state={dehydrate(queryNewAnimalFIlter)}>
			<NewAnimalForm userId={userId} />
		</HydrationBoundary>
	);
};

export default Index;
