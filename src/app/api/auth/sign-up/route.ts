// libs
import { mongoConnection } from "@/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// features
import postSignUp from "@/features/auth/signUp/api/postSignUp";
import { SuccessResponse, ErrorResponse } from "@/features/auth/signUp/api/postSignUp";

export type { SuccessResponse, ErrorResponse };

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	await mongoConnection();

	const formData = await req.formData();

	return await postSignUp({ formData });
}
