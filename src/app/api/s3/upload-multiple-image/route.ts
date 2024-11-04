import { mongoClient } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface SuccessResponse {
	success: true;
	urls: string[];
}

export interface ErrorResponse {
	success: false;
}

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION || "",
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
	},
});

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	try {
		await mongoClient();

		const formData = await req.formData();

		const { id, keyName } = Object.fromEntries(formData.entries()) as {
			id: string;
			keyName: string;
		};

		const files = formData.has("files[]") ? (formData.getAll("files[]") as File[]) : [];

		const uploadedSecodaryPhotos = files.map(async (file, index) => {
			const fileBuffer = Buffer.from(await file.arrayBuffer());
			const key = `${id}${keyName}${index + 1}`;
			const fileType = file.type;

			const params = {
				Bucket: process.env.AWS_S3_BUCKET_NAME || "",
				Key: key,
				Body: fileBuffer,
				ContentType: fileType,
			};

			const command = new PutObjectCommand(params);
			await s3Client.send(command);

			return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
		});

		const urls = await Promise.all(uploadedSecodaryPhotos);

		return NextResponse.json({ success: true, urls: urls }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
