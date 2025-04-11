import { MarkerCoordinates } from "@/shared/shared/GoogleMap";

type availableAnimalOptionsType = {
	state: string[];
	city: Record<string, string[]>;
	sheltersList: Record<string, { name: string; coordinates: MarkerCoordinates }>;
};

export default availableAnimalOptionsType;
