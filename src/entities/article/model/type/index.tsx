import { Types } from "mongoose";

export type ArticleType = {
	_id: Types.ObjectId;
	category: string;
	title: string;
	text: string;
	author: Types.ObjectId;
	image: string;
	viewsCount: number;
	createdAt: Date;
	updatedAt: Date;
};
