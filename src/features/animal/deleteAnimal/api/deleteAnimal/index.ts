// libs
import { mongoConnection } from "@/lib/mongodb";
// next tools
import { NextResponse } from "next/server";
// entities
import AnimalModel from "@/entities/animal/model/model";
import ShelterModel from "@/entities/shelter/model/model";
import UserModel from "@/entities/profile/model/model";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

type Props = {
	formData: FormData;
};

const Index = async ({ formData }: Props) => {
	try {
		await mongoConnection();

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
};

export default Index;
