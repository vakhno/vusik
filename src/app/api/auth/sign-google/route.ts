// features
import getAuth from "@/features/auth/googleAuth/api/getAuth";

export async function GET() {
	return getAuth();
}
