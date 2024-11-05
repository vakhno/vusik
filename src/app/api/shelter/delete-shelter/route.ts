import { mongoConnection } from "@/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// model
import AnimalModel from "@/models/animal.model";
import ShelterModel from "@/models/shelter.model";
// mongoose
import UserModel from "@/models/user.model";
import { ShelterType } from "@/types/shelter.type";

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
		const shelterId = formData.get("shelterId");

		const shelter = (await ShelterModel.findById(shelterId)) as ShelterType;

		if (shelter) {
			const { _id, userId, activeMembers, adoptedMembers } = shelter;

			await ShelterModel.deleteOne({ _id: _id });

			await AnimalModel.deleteMany({ _id: { $in: activeMembers } });

			await AnimalModel.deleteMany({ _id: { $in: adoptedMembers } });

			await UserModel.findByIdAndUpdate(userId, {
				$pull: {
					shelters: _id,
				},
			});

			await UserModel.findByIdAndUpdate(userId, {
				$pull: {
					animals: { $in: activeMembers || adoptedMembers },
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
