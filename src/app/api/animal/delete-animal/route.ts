// shared
import { mongoConnection } from "@/shared/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// entities
import AnimalModel from "@/entities/animal/model/model";
import ShelterModel from "@/entities/shelter/model/model";
import UserModel from "@/entities/profile/model/model";

export type SuccessResponse = {
	success: true;
};

export type ErrorResponse = {
	success: false;
	error: {
		message: string;
		code: number;
	};
};

export async function DELETE(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const url = new URL(req.url);
		const searchParams = url.searchParams;
		const animalId = searchParams.get("animalId");

		if (animalId) {
			const animal = await AnimalModel.findById(animalId);

			if (!animal) {
				return NextResponse.json({ success: false, error: { message: "", code: 404 } }, { status: 404 });
			} else {
				const { shelterId, userId } = animal;

				await AnimalModel.deleteOne({ _id: animalId });

				await ShelterModel.findByIdAndUpdate(shelterId, {
					$pull: { activeMembers: animalId, adoptedMembers: animalId },
				});

				await UserModel.findByIdAndUpdate(userId, { $pull: { animals: animalId } });

				return NextResponse.json({ success: true }, { status: 200 });
			}
		} else {
			return NextResponse.json({ success: false, error: { message: "", code: 404 } }, { status: 404 });
		}
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: "", code: 500 } }, { status: 500 });
	}
}
