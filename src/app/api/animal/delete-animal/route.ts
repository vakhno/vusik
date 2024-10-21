import { mongoConnection } from "@/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// model
import AnimalModel from "@/models/animal.model";
import ShelterModel from "@/models/shelter.model";
// mongoose
import UserModel from "@/models/user.model";

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
		const data = Object.fromEntries(formData.entries()) as { [key: string]: unknown };
		const { animalId, shelterId, userId } = data;

		await AnimalModel.deleteOne({ _id: animalId });

		await ShelterModel.findByIdAndUpdate(shelterId, {
			$pull: {
				activeMembers: animalId,
				adoptedMembers: animalId,
			},
		});

		await UserModel.findByIdAndUpdate(userId, { $pull: { animals: animalId } });

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
