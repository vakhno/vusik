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
	PROFILE_ROUTE,
	SHELTER_ROUTE,
	ANIMAL_ROUTE,
	OWN_PROFILE_ROUTE,
	API_NEW_ANIMAL,
	API_DELETE_ANIMAL,
	API_NEW_SHELTER,
	API_ANIMAL_PREFIX,
	API_SHELTER_PREFIX,
	API_NEW_GET_USER_SHELTERS_BY_ID,
	API_NEW_GET_USER_ANIMALS_BY_ID,
	API_GET_ANIMAL_BY_ID,
} from "@/routes";
// next-intl
import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
export default createMiddleware({
	locales: ["en", "ua"],
	defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
	const { nextUrl } = req;
	const isLoggedIn = req.cookies.has("token") || false;
	const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
	const isApiUserRoute = nextUrl.pathname.startsWith(API_USER_PREFIX);
	const isApiAnimalRoute = nextUrl.pathname.startsWith(API_ANIMAL_PREFIX);
	const isApiShelterRoute = nextUrl.pathname.startsWith(API_SHELTER_PREFIX);
	const isApiNewAnimal = nextUrl.pathname.startsWith(API_NEW_ANIMAL);
	const isApiDeleteAnimal = nextUrl.pathname.startsWith(API_DELETE_ANIMAL);
	const isApiNewShelter = nextUrl.pathname.startsWith(API_NEW_SHELTER);
	const isApiGetUserSheltersById = nextUrl.pathname.startsWith(API_NEW_GET_USER_SHELTERS_BY_ID);
	const isApiGetUserAnimalsById = nextUrl.pathname.startsWith(API_NEW_GET_USER_ANIMALS_BY_ID);
	const isApiGetAnimalById = nextUrl.pathname.startsWith(API_GET_ANIMAL_BY_ID);
	const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
	const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
	const isApiS3Route = nextUrl.pathname.startsWith(API_S3_PREFIX);
	const isProfileRoute = nextUrl.pathname.startsWith(PROFILE_ROUTE);
	const isOwnProfileRoute = nextUrl.pathname.startsWith(OWN_PROFILE_ROUTE);
	const isAnimalRoute = nextUrl.pathname.startsWith(ANIMAL_ROUTE);
	const isShelterRoute = nextUrl.pathname.startsWith(SHELTER_ROUTE);

	if (isOwnProfileRoute) {
		if (isLoggedIn) {
			return;
		} else {
			return Response.redirect(new URL(SIGN_IN_ROUTE, nextUrl));
		}
	}

	if (isProfileRoute) {
		const cookie = cookies();
		const token = cookie.get("token");
		if (token) {
			const { value } = token;
			const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/user/user-by-token`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${value}`,
				},
				credentials: "include",
			});
			const { ok } = response;
			if (ok) {
				const data = await response.json();
				const { _id } = data.user;
				const urlId = nextUrl.pathname.split("/")[2];
				if (_id === urlId) {
					return Response.redirect(new URL(OWN_PROFILE_ROUTE, nextUrl));
				}
			}
		}
		return;
	}

	if (
		isApiAuthRoute ||
		isApiUserRoute ||
		isApiS3Route ||
		isApiAnimalRoute ||
		isApiShelterRoute ||
		isApiNewAnimal ||
		isApiDeleteAnimal ||
		isApiNewShelter ||
		isApiGetUserSheltersById ||
		isApiGetUserAnimalsById ||
		isApiGetAnimalById
	) {
		return;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(HOME_ROUTE, nextUrl));
		} else {
			return;
		}
	}

	if (!isLoggedIn && !isPublicRoute && !isProfileRoute && !isAnimalRoute && !isShelterRoute) {
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
