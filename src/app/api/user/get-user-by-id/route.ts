import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";
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
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id } = searchParams;
		const user = await UserModel.findById(id);
		// .populate("animals")
		// .populate("shelters")
		// .populate({ path: "articles", model: ArticleModel });

		return NextResponse.json({ success: true, user: user }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
