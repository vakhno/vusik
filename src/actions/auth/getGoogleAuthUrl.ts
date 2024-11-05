interface Props {
	successRedirection: string;
	errorRedirection: string;
}

export function getGoogleAuthUrl({ successRedirection, errorRedirection }: Props): string {
	const stateStr = `${successRedirection} ${errorRedirection}`;
	const url = `https://accounts.google.com/o/oauth2/v2/auth`;
	const options = {
		redirect_uri: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI || "",
		client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || "",
		state: stateStr,
		success: "TOP",
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: ["profile", "email"].join(" "),
	};
	const urlOptions = new URLSearchParams(options);

	return `${url}?${urlOptions.toString()}`;
}
