import { mongoClient } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export interface SuccessResponse {
	success: true;
	url: string;
}

export interface ErrorResponse {
	success: false;
}

const s3Clinet = new S3Client({
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
		const { file, id } = Object.fromEntries(formData.entries()) as {
			file: File;
			id: string;
		};
		const fileBuffer: Buffer = Buffer.from(await file?.arrayBuffer());
		const keyName: string = `${id}/avatar/original`;
		const fileType: string = file.type;
		const params = {
			Bucket: process.env.AWS_S3_BUCKET_NAME || "",
			Key: keyName,
			Body: fileBuffer,
			ContentType: fileType,
		};
		const command = new PutObjectCommand(params);

		await s3Clinet.send(command);

		const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${keyName}`;

		return NextResponse.json({ success: true, url: url }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
