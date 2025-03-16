// features
import getEditAnimalFilters, { ErrorResponse, SuccessResponse } from "@/features/animal/editAnimal/api/getAnimalFields";

export type { ErrorResponse, SuccessResponse };

export async function GET(req: Request) {
	const result = await getEditAnimalFilters({ req });

	return result;
}
