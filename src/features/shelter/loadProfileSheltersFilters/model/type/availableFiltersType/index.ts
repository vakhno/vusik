import { MarkerCoordinates } from "@/widget/googleMap/map";

type availableAnimalOptionsType = {
	state: string[];
	city: Record<string, string[]>;
	sheltersList: Record<string, { name: string; coordinates: MarkerCoordinates }>;
};

export default availableAnimalOptionsType;
