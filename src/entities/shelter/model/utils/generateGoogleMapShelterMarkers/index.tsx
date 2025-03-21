// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import ShelterMapMarker from "@/entities/shelter/ui/shelterMapMarker";
// shared
import { MarkerType } from "@/shared/shared/GoogleMap";

const Index = (shelters: ShelterType[]): MarkerType[] => {
	return shelters.map((shelter, index) => (
		<ShelterMapMarker key={index} position={shelter.coordinates} shelter={shelter} />
	));
};

export default Index;
