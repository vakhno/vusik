// mongoose
import { Types } from "mongoose";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { AnimalType } from "@/entities/animal/model/type/animal";

// when we need to use user data how it contains in DB
export type PopulatedUserType = {
	_id: Types.ObjectId;
	role: string;
	email: string;
	password?: string;
	avatar: string | null;
	name: string;
	isSocial: boolean;
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
