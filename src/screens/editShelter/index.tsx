// features
import EditShelterForm from "@/features/shelter/editShelter/ui/editShelterForm";

type Props = {
	shelterId: string;
};

const Page = async ({ shelterId }: Props) => {
	if (shelterId) {
		return <EditShelterForm shelterId={shelterId} />;
	} else {
		return null;
	}
};

export default Page;
