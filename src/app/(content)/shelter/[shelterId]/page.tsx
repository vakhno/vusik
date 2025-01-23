"use server";

// features
import Shelter from "@/features/shelter";
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
		const queryShelter = await queryPrefetchShelter({ shelterId: shelterId });

		return (
			<HydrationBoundary state={dehydrate(queryShelter)}>
				<Shelter shelterId={shelterId} />
			</HydrationBoundary>
		);
	} else {
		return null;
	}
};

export default Page;
