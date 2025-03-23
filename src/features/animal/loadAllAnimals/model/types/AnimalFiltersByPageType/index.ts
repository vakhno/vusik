type AnimalFiltersByPageType = {
	injury?: boolean;
	sterilized?: boolean;
	state?: string[];
	city?: string[];
	species?: string[];
	breed?: string[];
	size?: string[];
	sex?: string[];
	page?: number;
};

export default AnimalFiltersByPageType;
