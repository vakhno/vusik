import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/models/user.model";

export async function POST(req: Request) {
	try {
		await mongoConnection();

		const formData = await req.formData();
		const data = Object.fromEntries(formData.entries());
		const { userId } = data;
		const user = await UserModel.findById(userId).populate("animals").populate("shelters");

		if (user) {
			return Response.json({ success: true, user: user }, { status: 200 });
		} else {
			return Response.json({ success: true }, { status: 400 });
		}
	} catch (_) {
		return Response.json({ success: false }, { status: 500 });
	}
}
