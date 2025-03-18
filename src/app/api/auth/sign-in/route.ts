// features
import postSignIn, { SuccessResponse, ErrorResponse } from "@/features/auth/signIn/api/signIn";

export type { SuccessResponse, ErrorResponse };

export async function POST(req: Request) {
	const result = await postSignIn({ req });

	return result;
}
