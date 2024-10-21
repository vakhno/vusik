import { Types } from "mongoose";

export type AnimalSchemaType = {
	_id: Types.ObjectId;
	name: string;
	species: string;
	breed: string;
	userId: Types.ObjectId;
	shelterId: Types.ObjectId;
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

export type AnimalType = {
	_id: Types.ObjectId;
	name: string;
	species: string;
	breed: string;
	userId: Types.ObjectId;
	shelterId: Types.ObjectId;
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
