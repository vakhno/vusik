// import { mongoConnection } from "@/lib/mongodb";
// import ShelterModel from "@/entities/shelter/model/model";
// import { ShelterType } from "@/entities/shelter/model/type/shelter";
// import { NextResponse } from "next/server";
// import { validateToNaturalNumber } from "@/utils/number";
// import { validateShelterFilterKeysAndValues } from "@/utils/filter";
// import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
// import { sheltersPerPage } from "@/constants/counts";

// export type SuccessResult = {
// 	success: true;
// 	shelters: ShelterType[];
// 	isHasMore: boolean;
// };

// export type ErrorResult = {
// 	success: false;
// };

// export async function GET(req: Request): Promise<NextResponse<SuccessResult | ErrorResult>> {
// 	try {
// 		await mongoConnection();
// 		const { searchParams: URLSearchParams } = new URL(req.url);
// 		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
// 		const { page, id, ...filterParams } = searchParams;
// 		// need to validate to get natural number of the page
// 		const pageParam = page[0];
// 		const idParam = id[0];
// 		const validatePage = validateToNaturalNumber(pageParam);
// 		// need to validate shelter filters, becaue user can pass non-existing keys, so non-existing keys be removed
// 		// but we dont check if values of the keys
// 		const validatedFilterParams = validateShelterFilterKeysAndValues(filterParams);

// 		let shelters = [];
// 		let isHasMore = false;

// 		shelters = await ShelterModel.find({ ...validatedFilterParams, userId: idParam })
// 			.skip((validatePage - 1) * sheltersPerPage)
// 			.limit(sheltersPerPage);
// 		const totalShelters = await ShelterModel.countDocuments({ ...validatedFilterParams, userId: idParam });
// 		isHasMore = validatePage * sheltersPerPage < totalShelters;

// 		return NextResponse.json({ success: true, shelters: shelters, isHasMore: isHasMore }, { status: 200 });
// 	} catch (_) {
// 		return NextResponse.json({ success: false }, { status: 500 });
// 	}
// }

import { NextResponse } from "next/server";
import getProfileShelters, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/shelter/loadProfileShelters/api/getProfileShelters";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getProfileShelters({ searchParams: URLSearchParams });
	return result;
}
