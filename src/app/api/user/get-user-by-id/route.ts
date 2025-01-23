import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import { gettingValuesFromURLSearchParams } from "@/utils/URLSearchParams";

export async function GET(req: Request) {
	try {
		await mongoConnection();

		const { searchParams: URLSearchParams } = new URL(req.url);
		const searchParams = gettingValuesFromURLSearchParams(URLSearchParams);
		const { id } = searchParams;
		const user = await UserModel.findById(id);
		// .populate("animals")
		// .populate("shelters")
		// .populate({ path: "articles", model: ArticleModel });

		return Response.json({ success: true, user: user }, { status: 200 });
	} catch (_) {
		return Response.json({ success: false }, { status: 500 });
	}
}
