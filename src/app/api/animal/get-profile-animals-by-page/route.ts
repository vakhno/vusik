import { NextResponse } from "next/server";
import getAllAnimals, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/animal/loadProfileAnimals/api/getProfileAnimals";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getAllAnimals({ searchParams: URLSearchParams });
	return result;
}
