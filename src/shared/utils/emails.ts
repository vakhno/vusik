import { TFunction } from "@/shared/types/nextIntl.type";

type UserAdoptionRequestEmailType = {
	logo: string;
	userName: string;
	animalName: string;
	animalImageURL: string;
	currentYear: number;
	t: TFunction;
};

export const UserAdoptionRequestEmail = ({
	logo,
	userName,
	animalName,
	animalImageURL,
	currentYear,
	t,
}: UserAdoptionRequestEmailType) => {
	return {
		subject: `${t("adopt.email.subject")}`,
		body: `
    <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t("adopt.email.head.title")}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="background-color: #4CAF50; padding: 20px;">
                      <img src="${logo}" alt="${t("adopt.email.body.header.logo.alt")}" style="max-width: 150px; height: auto;" />
                    </td>
                  </tr>
                  <!-- Main -->
                  <tr>
                    <td style="padding: 30px; color: #333333;">
                      <h1 style="font-size: 24px; margin: 0 0 20px; color: #4CAF50;">${t("adopt.email.body.main.greeting", { userName })}</h1>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px;">${t("adopt.email.body.main.welcome", { animalName })}</p>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center" style="padding: 0 0 20px;">
                            <img src="${animalImageURL}" alt="${t("adopt.email.body.main.animal-image.alt")}" style="max-width: 300px; height: auto; border-radius: 8px; border: 2px solid #ddd;" />
                          </td>
                        </tr>
                      </table>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0 0 20px;">${t("adopt.email.body.main.message", { animalName })}</p>
                      <p style="font-size: 16px; line-height: 1.5; margin: 0;">${t("adopt.email.body.main.closing")}</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background-color: #f9f9f9; padding: 20px; font-size: 12px; color: #777777;">
                      <p style="margin: 0;">${t("adopt.email.body.footer", { year: currentYear })}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
	};
};
