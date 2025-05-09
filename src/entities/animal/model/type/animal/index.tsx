// mongoose
import { Types } from "mongoose";
// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { UserType } from "@/entities/profile/model/type/profile";

export type AnimalType = {
	_id: Types.ObjectId;
	status: "available" | "adopted" | "archived";
	name: string;
	species: string;
	breed: string;
	userId: Types.ObjectId;
	shelterId: Types.ObjectId;
	mainPhoto: string;
	secondaryPhotos: string[];
	size: string;
	sex: string;
	birthday: Date;
	color: string;
	sterilized: boolean;
	vaccinated: boolean;
	dewormed: boolean;
	passported: boolean;
	microchiped: boolean;
	isNeedMedicine: boolean;
	injury: boolean;
	isPaid: boolean;
	fee: number;
	shortDescription: string;
	aboutMe: string;
	needMedicineDescription: string;
	injuryDescription: string;
	createdAt: Date;
	updatedAt: Date;
};

export type PopulatedAnimalType = {
	_id: Types.ObjectId;
	status: "available" | "adopted" | "archived";
	name: string;
	species: string;
	breed: string;
	userId: UserType;
	shelterId: ShelterType;
	mainPhoto: string;
	secondaryPhotos: string[];
	size: string;
	sex: string;
	birthday: Date;
	color: string;
	sterilized: boolean;
	vaccinated: boolean;
	dewormed: boolean;
	passported: boolean;
	microchiped: boolean;
	isNeedMedicine: boolean;
	injury: boolean;
	isPaid: boolean;
	fee: number;
	shortDescription: string;
	aboutMe: string;
	needMedicineDescription: string;
	injuryDescription: string;
	createdAt: Date;
	updatedAt: Date;
};
