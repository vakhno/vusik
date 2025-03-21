import { mongoConnection } from "@/shared/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
import { UserType } from "@/entities/profile/model/type/profile";
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	user: UserType;
};

export type ErrorResponse = {
	success: false;
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = convertURLSearchParamsToObject(URLSearchParams);
		const { id } = searchParams;
		const user = await UserModel.findById(id).lean();
		if (user) {
			// .populate("animals")
			// .populate("shelters")
			// .populate({ path: "articles", model: ArticleModel });

			return NextResponse.json({ success: true, user: user }, { status: 200 });
		} else {
			return NextResponse.json({ success: false }, { status: 500 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
