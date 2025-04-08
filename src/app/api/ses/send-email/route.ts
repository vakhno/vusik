// aws
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// next tools
import { NextResponse } from "next/server";
// zod
import * as z from "zod";
// next-intl
import { getTranslations, getLocale } from "next-intl/server";
// shared
import convertFormDataToObject from "@/shared/utils/convertFormDataToObject";
import { AWS_S3_REGION, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, EMAIL_SOURCE } from "@/shared/constants/env";

const FormDataSchema = () => {
	return z.object({
		email: z.string().email(),
		subject: z.string(),
		body: z.string(),
	});
};

export interface SuccessResponse {
	success: true;
}

export interface ErrorResponse {
	success: false;
	error: { message: string; code: number };
}

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	try {
		if (!AWS_S3_REGION || !AWS_S3_ACCESS_KEY_ID || !AWS_S3_SECRET_ACCESS_KEY || !EMAIL_SOURCE) {
			return NextResponse.json({ success: false, error: { message: t("aws.ses.api.500.env_missing"), code: 400 } }, { status: 400 });
		}

		const formData = await req.formData();
		const data = convertFormDataToObject(formData);
		const validationResult = FormDataSchema().safeParse(data);
		const { success: isValidationPassed } = validationResult;

		if (!isValidationPassed) {
			const { errors } = validationResult.error;
			const errorMessage = errors[0].message;

			return NextResponse.json({ success: false, error: { message: t("aws.ses.api.400", { error: errorMessage }), code: 400 } }, { status: 400 });
		}

		const { data: validationData } = validationResult;
		const { email, subject, body } = validationData;

		const sesClient = new SESClient({
			region: AWS_S3_REGION,
			credentials: {
				accessKeyId: AWS_S3_ACCESS_KEY_ID,
				secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
			},
		});

		const params = {
			Source: EMAIL_SOURCE,
			Destination: {
				ToAddresses: [email],
			},
			Message: {
				Subject: {
					Data: subject,
				},
				Body: {
					Html: {
						Data: body,
					},
				},
			},
		};
		const command = new SendEmailCommand(params);

		await sesClient.send(command);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (_) {
		return NextResponse.json({ success: false, error: { message: t("aws.ses.api.500.default"), code: 500 } }, { status: 500 });
	}
}
