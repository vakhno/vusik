"use server";

//tanstack
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
// entities
import { prefetchQuery_getAnimalById } from "@/entities/animal/model/query/animalById";
import { prefetchQuery_getAnimalsRelatedToAnimal } from "@/entities/animal/model/query/animalsRelatedToAnimal";
import AnimalProfile from "@/entities/animal/ui/animalProfile";
// features
import LikeButton from "@/features/animal/likeAnimal/ui/likeAnimalButton";

type Props = {
	animalId: string;
};

const Index = async ({ animalId }: Props) => {
	if (animalId) {
		const queryClient = new QueryClient();

		await Promise.all([prefetchQuery_getAnimalById({ animalId, queryClient }), prefetchQuery_getAnimalsRelatedToAnimal({ animalId, queryClient })]);

		return (
			<HydrationBoundary state={dehydrate(queryClient)}>
				<AnimalProfile animalId={animalId} JSXLikeButton={LikeButton} />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Index;
