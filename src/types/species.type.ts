import { Types } from "mongoose";

export type SpeciesType = {
	_id: Types.ObjectId;
	name: string;
	breed: string[];
	sex: string[];
	size: string[];
};
