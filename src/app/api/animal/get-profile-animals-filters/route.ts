import { NextResponse } from "next/server";
import getProfileAnimalsFilters, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/animal/loadProfileAnimalsFilters/api/getProfileAnimalsFilters";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getProfileAnimalsFilters({ searchParams: URLSearchParams });
	return result;
}
