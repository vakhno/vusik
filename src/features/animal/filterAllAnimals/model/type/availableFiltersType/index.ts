type availableAnimalOptionsType = {
	species: string[];
	state: string[];
	breed: Record<string, string[]>;
	sex: Record<string, string[]>;
	size: Record<string, string[]>;
	city: Record<string, string[]>;
};

export default availableAnimalOptionsType;
