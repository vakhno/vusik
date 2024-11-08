// HOME ROUTE
export const HOME_ROUTE: string = "/";
// PUBLIC ROUTES
export const PUBLIC_ROUTES: (string | RegExp)[] = [
	"/",
	"/terms-of-use",
	"/auth/sign-in",
	"/auth/sign-up",
	"/auth/sign-google",
	"/profile",
	"/animal",
	"/shelter",
	"/robots.txt",
];
// AUTH ROUTES
export const AUTH_ROUTES: string[] = ["/auth/sign-in", "/auth/sign-up", "/auth/sign-google"];
export const SIGN_IN_ROUTE: string = "/auth/sign-in";
export const SIGN_UP_ROUTE: string = "/auth/sign-up";
// PROFILE ROUTE
export const PROFILE_ROUTE: string = "/profile";
export const OWN_PROFILE_ROUTE: string = "/profile/myprofile";
// ANIMAL ROUTE
export const ANIMAL_ROUTE: string = "/animal";
// SHELTER ROUTE
export const SHELTER_ROUTE: string = "/shelter";
// API PREFIXES
export const API_AUTH_PREFIX: string = "/api/auth";
export const API_USER_PREFIX: string = "/api/user";
export const API_ANIMAL_PREFIX: string = "/api/animal";
export const API_SHELTER_PREFIX: string = "/api/shelter";
export const API_S3_PREFIX: string = "/api/s3";
// ANIMAL API
export const API_NEW_ANIMAL: string = "/api/animal/new-animal";
export const API_DELETE_ANIMAL: string = "/api/animal/delete-animal";
export const API_GET_ANIMAL_BY_ID: string = "/api/animal/get-animal-by-id";
export const API_NEW_GET_USER_ANIMALS_BY_ID: string = "/api/animal/get-user-animals-by-id";
export const API_GET_ANIMALS_BY_PAGE: string = "/api/animal/get-animals-by-page";
export const API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS: string = "/api/animal/get-filter-options-for-all-animals";
export const API_GET_BY_USER_ID_ANIMALS_BY_PAGE: string = "/api/animal/get-by-user-id-animals-by-page";
// SHELTER API
export const API_NEW_SHELTER: string = "/api/shelter/new-shelter";
export const API_NEW_GET_USER_SHELTERS_BY_ID: string = "/api/shelter/get-user-shelters-by-id";
export const API_PUT_EDIT_SHELTER: string = "/api/shelter/put-edit-shelter";
// USER API
export const API_USER_USER_BY_TOKEN: string = "/api/user/user-by-token";
export const API_USER_GET_USER_BY_ID: string = "/api/user/get-user-by-id";
// AUTH API
export const API_AUTH_SIGN_IN: string = "/api/auth/sign-in";
export const API_AUTH_SIGN_UP: string = "/api/auth/sign-up";
// S3 API
export const API_S3_UPLOAD_AVATAR: string = "/api/s3/upload-avatar";
// REDIRECTION
export const DEFAULT_SIGN_IN_REDIRECTION: string = "/";
export const DEFAULT_SIGN_UP_REDIRECTION: string = "/";
