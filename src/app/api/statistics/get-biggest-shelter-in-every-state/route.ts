import { mongoConnection } from "@/lib/mongodb";
import ShelterModel from "@/entities/shelter/model/model";
import { ShelterType } from "@/entities/shelter/model/type";
import { NextResponse } from "next/server";

type SuccessResponse = {
	success: true;
	shelters: ShelterType[];
};

type ErrorResponse = {
	success: false;
};

export async function GET(): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const shelters = await ShelterModel.aggregate([
			{
				$addFields: {
					activeMembersCount: { $size: "$activeMembers" },
				},
			},
			{
				$sort: { state: 1, activeMembersCount: -1 },
			},
			{
				$group: {
					_id: "$state",
					largestShelter: {
						$first: "$$ROOT",
					},
				},
			},
			{
				$project: {
					_id: 0,
					state: "$_id",
					largestShelter: 1,
				},
			},
		]);
		return NextResponse.json({ success: true, shelters: shelters }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
