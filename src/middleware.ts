// jose
import { jwtVerify } from "jose";
// next tools
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
// routes
import { AUTH_ROUTES, SIGN_IN_ROUTE, HOME_ROUTE, PROFILE_ROUTE, MY_PROFILE_ROUTE } from "@/shared/constants/routes";
// next-intl
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
	locales: ["en", "uk"],
	defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
	const { nextUrl } = req;
	// check if user has auth token
	const isLoggedIn = req.cookies.has("token") || false;
	// if url process.env.NEXT_PUBLIC_ACTIVE_DOMEN/myprofile
	const isMyProfileRoute = nextUrl.pathname.startsWith(MY_PROFILE_ROUTE);
	// if auth route
	const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
	// if profile route
	const isProfileRoute = nextUrl.pathname.startsWith(PROFILE_ROUTE);

	// if auth route
	if (isAuthRoute) {
		// if already sign in then redirect to home page
		if (isLoggedIn) {
			return Response.redirect(new URL(HOME_ROUTE, nextUrl));
		}
		return;
	}

	// if own profile route
	if (isMyProfileRoute) {
		// if not sign in then redirect to sign in page
		if (!isLoggedIn) {
			return Response.redirect(new URL(SIGN_IN_ROUTE, nextUrl));
		}
		return;
	}

	// if profile route
	if (isProfileRoute) {
		// if user logged in
		if (isLoggedIn) {
			const urlId = nextUrl.pathname.split("/")[2];
			const cookie = cookies();
			const token = cookie.get("token");
			const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET || "");
			const verifiedJWT = await jwtVerify(token?.value || "", secret);
			const { payload } = verifiedJWT;
			const { id } = payload;
			// if url id and token id of profile is same, then its own user profile, then redirect to /myprofile route
			if (id === urlId) {
				return Response.redirect(new URL(MY_PROFILE_ROUTE, nextUrl));
			}
		}
		return;
	}

	return;
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
