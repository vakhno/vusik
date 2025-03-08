// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { ArticleType } from "@/entities/article/model/type/article";

const ArticleSchema = new Schema<ArticleType>(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		text: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			default: null,
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

const ArticleModel = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default ArticleModel;
