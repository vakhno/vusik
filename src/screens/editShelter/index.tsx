import { Types } from "mongoose";
import EditShelterForm from "@/features/shelter/editShelter/ui/editShelterForm";

type Props = {
	shelterId: Types.ObjectId;
};

const Page = async ({ shelterId }: Props) => {
	return <EditShelterForm shelterId={shelterId} />;
};

export default Page;
