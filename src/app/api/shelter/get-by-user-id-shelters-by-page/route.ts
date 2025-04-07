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
