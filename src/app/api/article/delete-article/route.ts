import { mongoConnection } from "@/shared/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// model
import ArticleModel from "@/entities/article/model/model";
// mongoose
import UserModel from "@/entities/profile/model/model";
import { ArticleType } from "@/entities/article/model/type/article";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

export async function DELETE(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const formData = await req.formData();
		const articleId = formData.get("articleId");

		const article = (await ArticleModel.findById(articleId)) as ArticleType;

		if (article) {
			const { _id, userId } = article;

			await ArticleModel.deleteOne({ _id: _id });

			await UserModel.findByIdAndUpdate(userId, {
				$pull: {
					articles: _id,
				},
			});

			return NextResponse.json({ success: true }, { status: 200 });
		} else {
			return NextResponse.json({ success: false }, { status: 400 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
