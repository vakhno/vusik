import { NextResponse } from "next/server";
import { SUCCESS_SIGN_IN_REDIRECTION, FAILED_SIGN_IN_REDIRECTION } from "@/shared/constants/routes";

const Index = () => {
	try {
		const stateStr = `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${SUCCESS_SIGN_IN_REDIRECTION} ${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${FAILED_SIGN_IN_REDIRECTION}`;
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
		const finishedUrl = `${url}?${urlOptions.toString()}`;
		return NextResponse.redirect(finishedUrl);
	} catch (_) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}${FAILED_SIGN_IN_REDIRECTION}`);
	}
};

export default Index;
