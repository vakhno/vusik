import { Types } from "mongoose";
import { UserType } from "@/entities/profile/model/type/profile";
import { AnimalType } from "@/entities/animal/model/type/animal";

export type ShelterType = {
	_id: Types.ObjectId;
	userId: UserType;
	name: string;
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
	activeMembers: AnimalType[];
	adoptedMembers: AnimalType[];
	deletedMembers: AnimalType[];
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
