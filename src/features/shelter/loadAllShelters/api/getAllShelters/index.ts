// shared
import { mongoConnection } from "@/shared/lib/mongodb";
import { sheltersPerPage } from "@/shared/constants/counts";
// entities
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// next tools
import { NextResponse } from "next/server";
// features
import convertSearchParamsToAnimalFiltersByPage from "@/features/shelter/loadAllShelters/model/utils/convertSearchParamsToAnimalFiltersByPage";

export type SuccessResponse = {
	success: true;
	shelters: ShelterType[];
	isHasMore: boolean;
};

export type ErrorResponse = {
	success: false;
};

type Props = {
	searchParams: URLSearchParams;
};

const Index = async ({ searchParams }: Props): Promise<NextResponse<SuccessResponse | ErrorResponse>> => {
	try {
		await mongoConnection();

		const parsedParams = convertSearchParamsToAnimalFiltersByPage(searchParams);
		const { page = 1, ...filterParams } = parsedParams;
		const validatedFilters = filterParams;
		const shelters = await ShelterModel.find(filterParams)
			.skip((page - 1) * sheltersPerPage)
			.limit(sheltersPerPage);
		const totalShelters = await ShelterModel.countDocuments(validatedFilters);
		const isHasMore = page * sheltersPerPage < totalShelters;

		return NextResponse.json({ success: true, shelters: shelters, isHasMore: isHasMore }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
};

export default Index;
