import { Types } from "mongoose";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { UserType } from "@/entities/profile/model/type/profile";

export type AnimalType = {
	_id: Types.ObjectId;
	name: string;
	species: string;
	breed: string;
	userId: UserType;
	shelterId: ShelterType;
	mainPhoto: string;
	secondaryPhotos: string[];
	size: string;
	sex: string;
	age: string;
	sterilized: boolean;
	injury: boolean;
	injuryDescription: string;
	createdAt: Date;
	updatedAt: Date;
};
