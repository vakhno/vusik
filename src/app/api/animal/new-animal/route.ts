import { mongoConnection } from "@/shared/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { getTranslations } from "next-intl/server";
import NewAnimalSchema from "@/entities/animal/model/schema/newAnimalForm";
import NewAnimalSchemaType from "@/entities/animal/model/type/newAnimalForm";
import { AuthUserTokenDataType } from "@/shared/types/token.type";
import { animalMainPhotoKeyName, animalSecondaryPhotosKeyName } from "@/shared/constants/s3";
import AnimalModel from "@/entities/animal/model/model";
import ShelterModel from "@/entities/shelter/model/model";
// import { getLocale } from "next-intl/server";
import { AnimalType } from "@/entities/animal/@x/shelter";

export interface SuccessResponse {
	success: true;
	animal: AnimalType;
}

export interface ErrorResponse {
	success: false;
}

const getFormDataValue = (formData: FormData): NewAnimalSchemaType => {
	const data = {} as NewAnimalSchemaType;

	if (formData.has("name") && formData.get("name")) {
		data.name = formData.get("name") as string;
	}

	if (formData.has("breed") && formData.get("breed")) {
		data.breed = formData.get("breed") as string;
	}

	if (formData.has("shelterId") && formData.get("shelterId")) {
		data.shelterId = formData.get("shelterId") as string;
	}

	if (formData.has("size") && formData.get("size")) {
		data.size = formData.get("size") as string;
	}

	if (formData.has("sex") && formData.get("sex")) {
		data.sex = formData.get("sex") as string;
	}

	if (formData.has("species") && formData.get("species")) {
		data.species = formData.get("species") as string;
	}

	if (formData.has("sterilized") && formData.get("sterilized")) {
		data.sterilized = JSON.parse(formData.get("sterilized") as string) as boolean;
	}

	if (formData.has("birthday") && formData.get("age")) {
		data.birthday = new Date(formData.get("birthday") as string) as Date;
	}

	if (formData.has("injury") && formData.get("injury")) {
		data.injury = JSON.parse(formData.get("injury") as string) as boolean;
	}

	if (formData.has("injuryDescription") && formData.get("injuryDescription")) {
		data.injuryDescription = formData.get("injuryDescription") as string;
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

	return data;
};

const checkIsTokenValid = async (): Promise<false | string> => {
	try {
		const cookie = cookies();
		const token = cookie.get("token")?.value;
		if (token) {
			const jwtData = jwt.verify(String(token), process.env.NEXT_PUBLIC_JWT_SECRET || "") as AuthUserTokenDataType;
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
		formData.append("keyName", animalMainPhotoKeyName);
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
		formData.append("keyName", animalSecondaryPhotosKeyName);
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

export async function POST(req: Request) {
	try {
		await mongoConnection();

		const formData = await req.formData();
		const tokenId = await checkIsTokenValid();

		if (tokenId) {
			const data = getFormDataValue(formData) as NewAnimalSchemaType;
			const validationResult = NewAnimalSchema().safeParse(data);

			if (validationResult) {
				const { mainPhoto, secondaryPhotos, ...animalData } = data;
				const animal = new AnimalModel(animalData);

				if (mainPhoto) {
					const result = await uploadMainPhoto(String(animal._id), mainPhoto);

					if (result) {
						animal.mainPhoto = result;
					}
				}

				if (secondaryPhotos && secondaryPhotos.length) {
					const result = await uploadSecondaryPhotos(animal._id.toString(), secondaryPhotos);

					if (result) {
						animal.secondaryPhotos = result;
					}
				}

				const shelter = await ShelterModel.findById(data.shelterId);

				if (shelter) {
					shelter.activeMembers.push(animal._id);

					await shelter.save();
				}

				const user = await UserModel.findById(tokenId);

				if (user) {
					user.animals.push(animal._id);

					animal.userId = user._id;

					await user.save();
				}

				await animal.save();

				return NextResponse.json({ success: true, animal: animal }, { status: 200 });
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
