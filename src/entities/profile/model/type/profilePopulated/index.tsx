// mongoose
import { Types } from "mongoose";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { AnimalType } from "@/entities/animal/model/type/animal";
import { ArticleType } from "@/entities/article/model/type/article";

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
	shelters: ShelterType[];
	articles: ArticleType[];
	animals: AnimalType[];
	createdAt: Date;
	updatedAt: Date;
};
