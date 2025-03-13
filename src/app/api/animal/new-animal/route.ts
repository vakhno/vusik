// features
import postNewAnimal from "@/features/animal/newAnimal/api/postNewAnimal";

export async function POST(req: Request) {
	const formData = await req.formData();
	const result = await postNewAnimal({ formData });

	return result;
}
