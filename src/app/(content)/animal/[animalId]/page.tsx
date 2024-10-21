"use server";

// features
import Animal from "@/features/animal";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// mongoose
import { queryPrefetchAnimal } from "@/queries/animal.query";

type Props = {
	params: { animalId: string };
};

const Page = async ({ params }: Props) => {
	const { animalId } = params;

	if (animalId) {
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimal = await queryPrefetchAnimal({ animalId: animalId });

		return (
			<HydrationBoundary state={dehydrate(queryAnimal)}>
				<Animal animalId={animalId} />
			</HydrationBoundary>
		);
		return <></>;
	} else {
		return null;
	}
};

export default Page;
