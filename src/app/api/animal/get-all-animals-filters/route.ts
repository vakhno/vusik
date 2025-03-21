import { NextResponse } from "next/server";
import getAllAnimalsFilters, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/animal/filterAllAnimals/api/getAllAnimalsFilters";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getAllAnimalsFilters({ searchParams: URLSearchParams });
	return result;
}
