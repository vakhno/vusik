import { NextResponse } from "next/server";
import getProfileArticles, {
	ErrorResponse,
	SuccessResponse,
} from "@/features/article/loadProfileArticles/api/getProfileArticles";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getProfileArticles({ searchParams: URLSearchParams });
	return result;
}
