// shared
import { mongoConnection } from "@/shared/lib/mongodb";
import convertURLSearchParamsToObject from "@/shared/utils/convertURLSearchParamsToObject";
// entities
import UserModel from "@/entities/profile/model/model";
import { UserType } from "@/entities/profile/model/type/profile";
// next tools
import { NextResponse } from "next/server";

export type SuccessResponse = {
	success: true;
	data: {
		user: UserType;
	};
};

export type ErrorResponse = {
	success: false;
	error: {
		message: string;
		code: number;
	};
};

export async function GET(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = convertURLSearchParamsToObject(URLSearchParams);
		const { id } = searchParams;
		const user = await UserModel.findById(id).lean();

		if (!user) {
			return NextResponse.json({ success: false, error: { message: "", code: 404 } }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: { user } }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
