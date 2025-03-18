// features
import putEditAnimal from "@/features/animal/editAnimal/api/putEditAnimal";

export async function PUT(req: Request) {
	const result = await putEditAnimal({ req });

	return result;
}
