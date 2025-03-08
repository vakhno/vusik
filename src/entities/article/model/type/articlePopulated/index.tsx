import { Types } from "mongoose";
import { UserType } from "@/entities/profile/model/type/profile";

export type ArticleType = {
	_id: Types.ObjectId;
	category: string;
	title: string;
	text: string;
	userId: UserType;
	image: string;
	viewsCount: number;
	createdAt: Date;
	updatedAt: Date;
};
