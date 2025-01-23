// zod
import * as z from "zod";

export const AnimalProfileSearchSchema = () =>
	// t: TFunction
	{
		return z.object({
			species: z.string().array(),
			breed: z.string().array(),
			sex: z.string().array(),
			age: z.string().array(),
			size: z.string().array(),
			state: z.string().array(),
			shelterId: z.string().array(),
			sterilized: z.boolean(),
			injury: z.boolean(),
		});
	};
