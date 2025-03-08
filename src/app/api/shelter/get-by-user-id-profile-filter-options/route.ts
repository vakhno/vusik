import { NextResponse } from "next/server";
import getProfileSheltersFilters, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/shelter/loadProfileSheltersFilters/api/getAllSheltersFilters";

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getProfileSheltersFilters({ searchParams: URLSearchParams });
	return result;
}
