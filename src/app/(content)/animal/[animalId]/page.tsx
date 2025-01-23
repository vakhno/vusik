// features
import Animal from "@/features/animal";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// mongoose
import { queryPrefetchAnimal } from "@/entities/animal/model/query/animalById";
import { Types } from "mongoose";
type Props = {
	params: { animalId: Types.ObjectId };
};

const Page = async ({ params }: Props) => {
	const { animalId } = params;

	if (animalId) {
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimal = await queryPrefetchAnimal({ animalId: animalId });

		return (
			<HydrationBoundary state={dehydrate(queryAnimal)}>
				<div className="w-full">
					<Animal animalId={animalId} />
				</div>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Page;
