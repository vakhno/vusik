import { Types } from "mongoose";
import EditAnimalForm from "@/features/animal/editAnimal/ui/editAnimalForm";
type Props = {
	animalId: Types.ObjectId;
};

const Page = async ({ animalId }: Props) => {
	return <EditAnimalForm animalId={animalId} />;
};

export default Page;
