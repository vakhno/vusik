// next tools
import type { NextRequest } from "next/server";
// routes
import {
	PUBLIC_ROUTES,
	API_AUTH_PREFIX,
	AUTH_ROUTES,
	SIGN_IN_ROUTE,
	HOME_ROUTE,
	API_USER_PREFIX,
	API_S3_PREFIX,
} from "@/routes";
// next-intl
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
	locales: ["en", "ua"],
	defaultLocale: "en",
});

export function middleware(req: NextRequest) {
	const { nextUrl } = req;
	const isLoggedIn = req.cookies.has("token") || false;
	const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
	const isApiUserRoute = nextUrl.pathname.startsWith(API_USER_PREFIX);
	const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
	const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
	const isApiS3Route = nextUrl.pathname.startsWith(API_S3_PREFIX);

	if (isApiAuthRoute || isApiUserRoute || isApiS3Route) {
		return;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(HOME_ROUTE, nextUrl));
		} else {
			return;
		}
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL(SIGN_IN_ROUTE, nextUrl));
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
