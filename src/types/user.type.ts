// mongoose
import { Types } from "mongoose";

// when we need to use user data how it contains in DB
export type UserType = {
	_id: Types.ObjectId;
	email: string;
	password?: string;
	avatar: string;
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
