import {
	SuccessResponse as S3UploadMainPhotoSuccessResponse,
	ErrorResponse as S3UploadMainPhotoErrorResponse,
} from "@/app/api/s3/upload-single-image/route";

type Props = {
	formData: FormData;
};

export const postSingleImage = async ({ formData }: Props): Promise<string | false> => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/s3/upload-single-image`, {
			method: "POST",
			body: formData,
		});
		const data: S3UploadMainPhotoSuccessResponse | S3UploadMainPhotoErrorResponse = await response.json();
		const { success } = data;
		if (success) {
			const { url } = data;
			return url;
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};
