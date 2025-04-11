// mongoose
import { Types } from "mongoose";

export type UserType = {
	_id: Types.ObjectId;
	role: string;
	email: string;
	password?: string;
	avatar?: string;
	name: string;
	isSocial: boolean;
	facebook?: string;
	instagram?: string;
	telegram?: string;
	twitter?: string;
	youtube?: string;
	shelters: Types.ObjectId[];
	animals: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
};
