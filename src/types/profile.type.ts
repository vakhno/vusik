// types
import { ShelterType } from "./shelter.type";
import { AnimalType } from "./animal.type";

export type ProfileType = {
	_id: string;
	email: string;
	avatar: string;
	name: string;
	facebook?: string;
	instagram?: string;
	telegram?: string;
	twitter?: string;
	youtube?: string;
	shelters: ShelterType[];
	animals: AnimalType[];
	createdAt: Date;
	updatedAt: Date;
};
