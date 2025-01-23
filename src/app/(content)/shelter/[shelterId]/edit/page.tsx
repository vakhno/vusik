// features
import EditShelter from "@/views/editShelter";
// tanstack
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
// mongoose
import { queryPrefetchShelter } from "@/entities/shelter/model/query/shelterById";
import { Types } from "mongoose";
type Props = {
	params: { shelterId: Types.ObjectId };
};

const Page = async ({ params }: Props) => {
	const { shelterId } = params;
	if (shelterId) {
		// to prefetch animals on first page with passed searchParams and to avoid showing loading/skeleton on first upload
		const queryAnimal = await queryPrefetchShelter({ shelterId: shelterId });
		// const queryClient = await queryPrefetchProfile({ userId: id });
		return (
			<HydrationBoundary state={dehydrate(queryAnimal)}>
				<div className="w-full">
					<EditShelter shelterId={shelterId} />
				</div>
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Page;
