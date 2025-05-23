import { ObjectId } from "mongoose";

export type ShelterType = {
	_id: string;
	userId: ObjectId;
	name: string;
	losung: string;
	mainPhoto: string;
	secondaryPhotos: string[];
	country: string;
	state: string;
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
	workingDays: {
		monday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
		tuesday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
		wednesday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
		thursday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
		friday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
		saturday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
		sunday: {
			isWeekend: boolean;
			begin: string;
			end: string;
		};
	};
	specificWeekends: { month: string; day: string }[];
};
