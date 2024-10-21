export type ShelterType = {
	_id: string;
	userId: string;
	name: string;
	mainPhoto: string;
	secondaryPhotos: string[];
	country: string;
	city: string;
	street: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	postalCode: string;
	activeMembers: string[];
	adoptedMembers: string[];
	phone: string;
	createdAt: Date;
	updatedAt: Date;
};
