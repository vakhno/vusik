import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextResponse } from "next/server";

export interface SuccessResponse {
	success: true;
	urls: string[];
}

export interface ErrorResponse {
	success: false;
}

const sesClient = new SESClient({
	region: process.env.AWS_S3_REGION || "",
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
	},
});

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const data = Object.fromEntries(formData.entries()) as { [key: string]: unknown };
		const { name, email } = data as { name: string; email: string };
		// Email content
		const params = {
			Source: process.env.EMAIL_SOURCE,
			Destination: {
				ToAddresses: [email],
			},
			Message: {
				Subject: {
					Data: "Hello from VUSIK!",
				},
				Body: {
					Text: {
						Data: `Hello ${name}!`,
					},
				},
			},
		};
		const command = new SendEmailCommand(params);
		await sesClient.send(command);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
