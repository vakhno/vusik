import { mongoConnection } from "@/lib/mongodb";
import ArticleModel from "@/entities/article/model/model";
import { NewArticleSchema } from "@/entities/article/model/schema/newArticleForm";
import { NewArticleSchemaType } from "@/entities/article/model/type/newArticleForm";
// import { getLocale } from "next-intl/server";
import { NextResponse } from "next/server";
import { articleMainPhotoKeyName } from "@/constants/s3";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

const getFormDataValue = (formData: FormData): NewArticleSchemaType => {
	const data = {} as NewArticleSchemaType & { id: string };

	if (formData.has("id") && formData.get("id")) {
		data.id = formData.get("id") as string;
	}

	if (formData.has("title") && formData.get("title")) {
		data.title = formData.get("title") as string;
	}

	if (formData.has("text") && formData.get("text")) {
		data.text = formData.get("text") as string;
	}

	if (formData.has("category") && formData.get("category")) {
		data.category = formData.get("category") as string;
	}

	if (formData.has("image") && formData.get("image")) {
		data.image = formData.get("image") as File;
	}

	return data;
};

const uploadMainPhoto = async (id: string, file: File): Promise<false | string> => {
	try {
		const formData = new FormData();

		formData.append("id", id);
		formData.append("keyName", articleMainPhotoKeyName);
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

export async function PUT(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const formData = await req.formData();
		const data = getFormDataValue(formData) as NewArticleSchemaType & { id: string };

		// const locale = await getLocale();
		// const t = await getTranslations({ locale });
		const validationResult = NewArticleSchema().safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (isValidationPassed) {
			const { id, image, ...readyData } = data;
			const updatedAnimal = new ArticleModel(readyData).toObject();
			const result1 = await deleteMainPhoto(id);

			if (result1) {
				if (image) {
					const result = await uploadMainPhoto(id, image);
					if (result) {
						updatedAnimal.image = result;
					}
				} else {
					updatedAnimal.image = undefined;
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

			if (!updatedAnimal.image) {
				updateQuery.$unset["image"] = "";
			}

			const editedAnimal = await ArticleModel.findByIdAndUpdate(id, updateQuery, { new: true });

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
