// features
import getCallback from "@/features/auth/googleAuth/api/getCallback";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	return await getCallback({ searchParams });
}
