import { NextResponse } from "next/server";
import getAllArticles, { ErrorResponse, SuccessResponse } from "@/features/article/loadAllArticles/api/getAllArticles";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const { searchParams: URLSearchParams } = new URL(req.url);
	const result = await getAllArticles({ searchParams: URLSearchParams });
	return result;
}
