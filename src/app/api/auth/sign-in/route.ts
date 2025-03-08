// libs
import { mongoConnection } from "@/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// features
import postSignIn from "@/features/auth/signIn/api/postSignIn";
import { SuccessResponse, ErrorResponse } from "@/features/auth/signIn/api/postSignIn";

export type { SuccessResponse, ErrorResponse };

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	await mongoConnection();

	const formData = await req.formData();

	return await postSignIn({ formData });
}
