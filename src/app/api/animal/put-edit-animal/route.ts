// features
import putEditAnimal from "@/features/animal/editAnimal/api/putEditAnimal";

export async function PUT(req: Request) {
	const formData = await req.formData();
	const result = await putEditAnimal({ formData });

	return result;
}
