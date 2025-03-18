import { mongoConnection } from "@/shared/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import { gettingValuesFromURLSearchParams } from "@/shared/utils/URLSearchParams";
import ArticleModel from "@/entities/article/model/model";
import { NextResponse } from "next/server";
import { PopulatedUserType } from "@/entities/profile/model/type/profilePopulated";
import ShelterModel from "@/entities/shelter/model/model";
import AnimalModel from "@/entities/animal/model/model";

export type SuccessResponse = {
	success: true;
	user: PopulatedUserType;
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
		const user = (await UserModel.findById(id)
			.populate({ path: "animals", model: AnimalModel })
			.populate({ path: "shelters", model: ShelterModel })
			.populate({ path: "articles", model: ArticleModel })
			.lean()) as PopulatedUserType | null;

		if (user) {
			return NextResponse.json({ success: true, user: user }, { status: 200 });
		} else {
			return NextResponse.json({ success: false }, { status: 500 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
