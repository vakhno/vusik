// HOME ROUTE
export const HOME_ROUTE: string = "/";
// PUBLIC ROUTES
export const PUBLIC_ROUTES: string[] = [
	"/",
	"/terms-of-use",
	"/auth/sign-in",
	"/auth/sign-up",
	"/auth/sign-google",
	"/robots.txt",
];
// AUTH ROUTES
export const AUTH_ROUTES: string[] = ["/auth/sign-in", "/auth/sign-up", "/auth/sign-google"];
export const SIGN_IN_ROUTE: string = "/auth/sign-in";
export const SIGN_UP_ROUTE: string = "/auth/sign-up";
// API PREFIXES
export const API_AUTH_PREFIX: string = "/api/auth";
export const API_USER_PREFIX: string = "/api/user";
export const API_S3_PREFIX: string = "/api/s3";
// API
export const API_AUTH_SIGN_IN: string = "/api/auth/sign-in";
export const API_AUTH_SIGN_UP: string = "/api/auth/sign-up";
export const API_USER_USER_BY_TOKEN: string = "/api/user/user-by-token";
export const API_S3_UPLOAD_AVATAR: string = "/api/s3/upload-avatar";
// REDIRECTION
export const DEFAULT_SIGN_IN_REDIRECTION: string = "/";
export const DEFAULT_SIGN_UP_REDIRECTION: string = "/";
