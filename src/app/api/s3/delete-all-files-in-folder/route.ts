import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION || "",
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
	},
});

export async function DELETE(req: Request) {
	try {
		const formData = await req.formData();
		const folderKey = formData.get("folderKey");

		if (folderKey) {
			const listParams = new ListObjectsV2Command({
				Bucket: process.env.AWS_S3_BUCKET_NAME?.toString(),
				Prefix: folderKey.toString(),
			});
			const listResponse = await s3Client.send(listParams);

			if (!listResponse.Contents || !listResponse.Contents.length) {
				return NextResponse.json({ success: true }, { status: 200 });
			} else {
				const objectsToDelete = listResponse.Contents.map((object) => ({ Key: object.Key }));
				const deleteCommand = new DeleteObjectsCommand({
					Bucket: process.env.AWS_S3_BUCKET_NAME?.toString(),
					Delete: {
						Objects: objectsToDelete,
						// AWS S3 will not return details about each object that was deleted successfully. Only details about errors, if any, will be returned
						Quiet: true,
					},
				});

				await s3Client.send(deleteCommand);

				return NextResponse.json({ success: true }, { status: 200 });
			}
		}
	} catch (_) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
