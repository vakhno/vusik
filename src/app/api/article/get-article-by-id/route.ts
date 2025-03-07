import { mongoConnection } from "@/lib/mongodb";
import ArticleModel from "@/entities/article/model/model";
import { ArticleType } from "@/entities/article/model/type/article";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
import { NextResponse } from "next/server";
import UserModel from "@/entities/profile/model/model";

type SuccessResponse = {
	success: true;
	article: ArticleType;
};

type ErrorResponse = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id } = searchParams;
		const article = await ArticleModel.findById(id).populate({ path: "userId", model: UserModel });
		return NextResponse.json({ success: true, article: article }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
