import { mongoConnection } from "@/lib/mongodb";
import UserModel from "@/models/user.model";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuthUserTokenDataType } from "@/types/token.type";
import { userAvatarPhotoKeyName } from "@/constants/s3";
import { EditUserSchemaType } from "@/schemas/user/userEdit.schema";

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
}

const getFormDataValue = (formData: FormData): EditUserSchemaType => {
	const data = {} as EditUserSchemaType & { id: string };

	if (formData.has("id") && formData.get("id")) {
		data.id = formData.get("id") as string;
	}

	if (formData.has("name") && formData.get("name")) {
		data.name = formData.get("name") as string;
	}

	if (formData.has("facebook") && formData.get("facebook")) {
		data.facebook = formData.get("facebook") as string;
	}

	if (formData.has("instagram") && formData.get("instagram")) {
		data.instagram = formData.get("instagram") as string;
	}

	if (formData.has("telegram") && formData.get("telegram")) {
		data.telegram = formData.get("telegram") as string;
	}

	if (formData.has("twitter") && formData.get("twitter")) {
		data.twitter = formData.get("twitter") as string;
	}

	if (formData.has("youtube") && formData.get("youtube")) {
		data.youtube = formData.get("youtube") as string;
	}

	if (formData.has("avatar") && formData.get("avatar")) {
		data.avatar = formData.get("avatar") as File;
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
		formData.append("keyName", userAvatarPhotoKeyName);
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

		formData.append("folderKey", `${id}/avatar/original`);

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

		const tokenId = await checkIsTokenValid();

		if (tokenId) {
			const formData = await req.formData();
			const data = getFormDataValue(formData) as EditUserSchemaType & { id: string };
			const { id, avatar, ...readyData } = data;
			const updatedUser = new UserModel(readyData).toObject();
			const result1 = await deleteMainPhoto(id);

			if (result1) {
				if (avatar) {
					const result = await uploadMainPhoto(id, avatar);
					if (result) {
						updatedUser.avatar = result;
					}
				} else {
					updatedUser.avatar = undefined;
				}
			}

			const { _id, ...updatedUserWithoutId } = updatedUser;
			const updateQuery: {
				$set: typeof updatedUserWithoutId;
				$unset: { [key: string]: unknown };
			} = {
				$set: updatedUserWithoutId,
				$unset: {},
			};

			if (!updatedUser.avatar) {
				updateQuery.$unset["avatar"] = "";
			}
			const editedUser = await UserModel.findByIdAndUpdate(id, updateQuery, { new: true });

			if (editedUser) {
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
