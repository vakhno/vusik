// features
import postSignUp, { SuccessResponse, ErrorResponse } from "@/features/auth/signUp/api/signUp";

export type { SuccessResponse, ErrorResponse };

export async function POST(req: Request) {
	const result = await postSignUp({ req });

	return result;
}
