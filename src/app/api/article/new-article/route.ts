import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/entities/profile/model/model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NewArticleSchema } from "@/entities/article/model/schema/newArticleForm";
import { NewArticleSchemaType } from "@/entities/article/model/type/newArticleForm";
import { AuthUserTokenDataType } from "@/types/token.type";
import { articleMainPhotoKeyName } from "@/constants/s3";
import ArticleModel from "@/entities/article/model/model";
// import { getLocale } from "next-intl/server";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

const getFormDataValue = (formData: FormData): NewArticleSchemaType => {
	const data = {} as NewArticleSchemaType;

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

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoConnection();

		const tokenId = await checkIsTokenValid();

		if (tokenId) {
			const formData = await req.formData();
			const data = getFormDataValue(formData) as NewArticleSchemaType;
			// const locale = await getLocale();
			// const t = await getTranslations({ locale });
			const validationResult = NewArticleSchema().safeParse(data);

			if (validationResult) {
				const mainPhoto = data.image;

				delete data.image;

				const article = new ArticleModel(data);

				delete article.mainPhoto;

				if (mainPhoto) {
					const result = await uploadMainPhoto(article._id, mainPhoto);
					if (result) {
						article.image = result;
					}
				}

				const user = await UserModel.findById(tokenId);
				user.articles.push(article._id);

				article.author = user._id;

				await user.save();

				await article.save();

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
