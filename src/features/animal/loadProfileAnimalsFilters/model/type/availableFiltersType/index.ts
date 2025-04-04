import { MarkerCoordinates } from "@/shared/shared/GoogleMap";

type availableAnimalOptionsType = {
	species: string[];
	state: string[];
	breed: Record<string, string[]>;
	sex: Record<string, string[]>;
	size: Record<string, string[]>;
	city: Record<string, string[]>;
	sheltersList: Record<string, { name: string; coordinates: MarkerCoordinates }>;
};

export default availableAnimalOptionsType;
