import { mongoConnection } from "@/lib/mongodb";
import ShelterModel from "@/models/shelter.model";
import { NewShelterSchemaType, NewShelterSchema } from "@/schemas/shelter/shelter.schema";
import { getLocale, getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { shelterMainPhotoKeyName, shelterSecondaryPhotosKeyName } from "@/constants/s3";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

const getFormDataValue = (formData: FormData): NewShelterSchemaType => {
	const data = {} as NewShelterSchemaType & { id: string };

	if (formData.has("id") && formData.get("id")) {
		data.id = formData.get("id") as string;
	}

	if (formData.has("name") && formData.get("name")) {
		data.name = formData.get("name") as string;
	}

	if (formData.has("country") && formData.get("country")) {
		data.country = formData.get("country") as string;
	}

	if (formData.has("city") && formData.get("city")) {
		data.city = formData.get("city") as string;
	}

	if (formData.has("street") && formData.get("street")) {
		data.street = formData.get("street") as string;
	}

	if (formData.has("coordinates") && formData.get("coordinates")) {
		data.coordinates = JSON.parse(formData.get("coordinates") as string) as { lat: number; lng: number };
	}

	if (formData.has("postalCode") && formData.get("postalCode")) {
		data.postalCode = formData.get("postalCode") as string;
	}

	if (formData.has("phone") && formData.get("phone")) {
		data.phone = formData.get("phone") as string;
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

const deleteMainPhoto = async (id: string): Promise<boolean> => {
	try {
		const formData = new FormData();

		formData.append("folderKey", `${id}/animal-main-photo`);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/s3/delete-all-files-in-folder`, {
			method: "DELETE",
			body: formData,
		});

		const { ok } = response;
		if (ok) {
			const data = await response.json();
			const { success } = data;
			if (success) {
				return true;
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
		if (files && files.length) {
			files.forEach((file) => {
				formData.append("files[]", file);
			});
		} else {
			formData.append("files[]", false);
		}
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

const deleteSecondaryPhotos = async (id: string): Promise<boolean> => {
	try {
		const formData = new FormData();

		formData.append("folderKey", `${id}/animal-secondary-photos`);

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/s3/delete-all-files-in-folder`, {
			method: "DELETE",
			body: formData,
		});

		const { ok } = response;
		if (ok) {
			const data = await response.json();
			const { success } = data;
			if (success) {
				return true;
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

export async function PUT(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const formData = await req.formData();
		const data = getFormDataValue(formData) as NewShelterSchemaType & { id: string };

		const locale = await getLocale();
		const t = await getTranslations({ locale });
		const validationResult = NewShelterSchema(t).safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (isValidationPassed) {
			const { id, mainPhoto, secondaryPhotos, ...readyData } = data;
			const updatedAnimal = new ShelterModel(readyData).toObject();
			const result1 = await deleteMainPhoto(id);

			if (result1) {
				if (mainPhoto) {
					const result = await uploadMainPhoto(id, mainPhoto);
					if (result) {
						updatedAnimal.mainPhoto = result;
					}
				} else {
					updatedAnimal.mainPhoto = undefined;
				}
			}

			const result2 = await deleteSecondaryPhotos(id);

			if (result2) {
				if (secondaryPhotos && secondaryPhotos.length) {
					const result = await uploadSecondaryPhotos(id, secondaryPhotos);
					if (result) {
						updatedAnimal.secondaryPhotos = result;
					}
				} else {
					updatedAnimal.secondaryPhotos = undefined;
				}
			}

			const { _id, ...updatedAnimalWithoutId } = updatedAnimal;
			const updateQuery: {
				$set: typeof updatedAnimalWithoutId;
				$unset: { [key: string]: unknown };
			} = {
				$set: updatedAnimalWithoutId,
				$unset: {},
			};

			if (!updatedAnimal.mainPhoto) {
				updateQuery.$unset["mainPhoto"] = "";
			}

			if (!updatedAnimal.secondaryPhotos) {
				updateQuery.$unset["secondaryPhotos"] = "";
			}
			const editedAnimal = await ShelterModel.findByIdAndUpdate(id, updateQuery, { new: true });

			if (editedAnimal) {
				return NextResponse.json({ success: true }, { status: 200 });
			} else {
				return NextResponse.json({ success: true }, { status: 400 });
			}
		} else {
			return NextResponse.json({ success: false }, { status: 400 });
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
