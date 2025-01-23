import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NewShelterSchema } from "@/entities/shelter/model/schema/newShelterForm";
import { NewShelterSchemaType } from "@/entities/shelter/model/type/newShelterForm";
import { AuthUserTokenDataType } from "@/types/token.type";
import { shelterMainPhotoKeyName, shelterSecondaryPhotosKeyName } from "@/constants/s3";
import ShelterModel from "@/entities/shelter/model/model";
import { getLocale, getTranslations } from "next-intl/server";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

const getFormDataValue = (formData: FormData): NewShelterSchemaType => {
	const data = {} as NewShelterSchemaType;

	if (formData.has("name") && formData.get("name")) {
		data.name = formData.get("name") as string;
	}

	if (formData.has("country") && formData.get("country")) {
		data.country = formData.get("country") as string;
	}

	if (formData.has("state") && formData.get("state")) {
		data.state = formData.get("state") as string;
	}

	if (formData.has("city") && formData.get("city")) {
		data.city = formData.get("city") as string;
	}

	if (formData.has("street") && formData.get("street")) {
		data.street = formData.get("street") as string;
	}

	if (formData.has("postalCode") && formData.get("postalCode")) {
		data.postalCode = formData.get("postalCode") as string;
	}

	if (formData.has("phone") && formData.get("phone")) {
		data.phone = formData.get("phone") as string;
	}

	if (formData.has("coordinates") && formData.get("coordinates")) {
		const coordinates = JSON.parse(formData.get("coordinates") as string);
		if (coordinates?.lat && coordinates?.lng) {
			data.coordinates = {
				lat: coordinates.lat,
				lng: coordinates.lng,
			};
		}
	}

	if (formData.has("workingDays") && formData.get("workingDays")) {
		const workingDays = JSON.parse(formData.get("workingDays") as string);
		data.workingDays = workingDays;
	}

	if (formData.has("mainPhoto") && formData.get("mainPhoto")) {
		data.mainPhoto = formData.get("mainPhoto") as File;
	}

	if (formData.has("secondaryPhotos[]") && formData.get("secondaryPhotos[]")) {
		const secondaryPhotos = formData.getAll("secondaryPhotos[]") as File[];

		if (Array.isArray(secondaryPhotos) && secondaryPhotos.length) {
			data.secondaryPhotos = secondaryPhotos;
		}
	}

	if (formData.has("specificWeekends[]") && formData.get("specificWeekends[]")) {
		const specificWeekends = formData.getAll("specificWeekends[]") as string[];

		if (Array.isArray(specificWeekends) && specificWeekends.length) {
			data.specificWeekends = specificWeekends.map((specificWeekend) => JSON.parse(specificWeekend));
		}
	}

	return data;
};

const checkIsTokenValid = async (): Promise<false | string> => {
	try {
		const cookie = cookies();
		const token = cookie.get("token")?.value;
		if (token) {
			const jwtData = jwt.verify(
				String(token),
				process.env.NEXT_PUBLIC_JWT_SECRET || "",
			) as AuthUserTokenDataType;
			const { id } = jwtData;
			const user = await UserModel.findById(id);
			if (user) {
				return id;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};

const uploadMainPhoto = async (id: string, file: File): Promise<false | string> => {
	try {
		const formData = new FormData();

		formData.append("id", id);
		formData.append("keyName", shelterMainPhotoKeyName);
		formData.append("file", file);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/s3/upload-single-image`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				const { url } = data;

				return url as string;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};

const uploadSecondaryPhotos = async (id: string, files: File[]): Promise<false | string[]> => {
	try {
		const formData = new FormData();

		formData.append("id", id);
		formData.append("keyName", shelterSecondaryPhotosKeyName);
		files.forEach((file) => {
			formData.append("files[]", file);
		});

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/s3/upload-multiple-image`, {
			method: "POST",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				const { urls } = data;

				return urls as string[];
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const tokenId = await checkIsTokenValid();

		if (tokenId) {
			const formData = await req.formData();
			const data = getFormDataValue(formData) as NewShelterSchemaType;
			const locale = await getLocale();
			const t = await getTranslations({ locale });
			const validationResult = NewShelterSchema(t).safeParse(data);

			if (validationResult) {
				const newShelter = new ShelterModel(data);

				newShelter.userId = tokenId;

				const mainPhoto = data.mainPhoto;

				if (mainPhoto) {
					const result = await uploadMainPhoto(newShelter._id, mainPhoto);
					if (result) {
						newShelter.mainPhoto = result;
					}
				}

				const secondaryPhotos = data?.secondaryPhotos;

				if (secondaryPhotos) {
					const result = await uploadSecondaryPhotos(newShelter._id, secondaryPhotos);
					if (result) {
						newShelter.secondaryPhotos = result;
					}
				}

				const user = await UserModel.findById(tokenId);
				user.shelters.push(newShelter._id);

				await user.save();

				await newShelter.save();

				return NextResponse.json({ success: true }, { status: 200 });
			} else {
				return NextResponse.json({ success: false }, { status: 400 });
			}
		} else {
			return NextResponse.json({ success: false }, { status: 400 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
