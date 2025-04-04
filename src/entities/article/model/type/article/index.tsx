import { Types } from "mongoose";

export type ArticleType = {
	_id: Types.ObjectId;
	category: string;
	title: string;
	text: string;
	userId: Types.ObjectId;
	image: string | null;
	viewsCount: number;
	createdAt: Date;
	updatedAt: Date;
};
