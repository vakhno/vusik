// next tools
import { NextResponse } from "next/server";
// features
import deleteAnimal, { SuccessResponse, ErrorResponse } from "@/features/animal/deleteAnimal/api/deleteAnimal";

export type { SuccessResponse, ErrorResponse };

export async function DELETE(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const result = await deleteAnimal({ req });

	return result;
}
