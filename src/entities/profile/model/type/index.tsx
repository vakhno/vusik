// mongoose
import { Types } from "mongoose";
// import { UserRole } from "@/constants/user";

// export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// when we need to use user data how it contains in DB
export type UserType = {
	_id: Types.ObjectId;
	role: string;
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
	articles: Types.ObjectId[];
	animals: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
};
