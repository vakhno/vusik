// SEPARATE PAGE ROUTES
// HOME ROUTE
export const HOME_ROUTE: string = "/";
// TERM OF USE ROUTE
export const TERM_OF_USE_ROUTE: string = "/terms-of-use";
// PRIVACY POLICY ROUTE
export const PRIVACY_POLICY_ROUTE: string = "/privacy-policy";
// SIGN IN ROUTE
export const SIGN_IN_ROUTE: string = "/auth/sign-in";
// SIGN UP ROUTE
export const SIGN_UP_ROUTE: string = "/auth/sign-up";
// PROFILE ROUTE
export const PROFILE_ROUTE: string = "/profile";
// MY PROFILE ROUTE
export const MY_PROFILE_ROUTE: string = "/profile/myprofile";
// NEW_ANIMAL ROUTE
export const NEW_ANIMAL_ROUTE: string = "/profile/myprofile/new-animal";
// ANIMAL ROUTE
export const ANIMAL_ROUTE: string = `/animal/:id`;
// EDIT ANIMAL ROUTE
export const EDIT_ANIMAL_ROUTE: string = `/animal/:id/edit`;
// ANIMALS ROUTE
export const ANIMALS_ROUTE: string = "/animals";
// SHELTER ROUTE
export const SHELTER_ROUTE: string = "/shelter";
// SHELTERS ROUTE
export const SHELTERS_ROUTE: string = "/shelters";

// SEPARATE API PREFIXES
// AUTH API PREFIX
export const API_AUTH_PREFIX: string = "/api/auth";
// USER API PREFIX
export const API_USER_PREFIX: string = "/api/user";
// ANIMAL API PREFIX
export const API_ANIMAL_PREFIX: string = "/api/animal";
// SHELTER API PREFIX
export const API_SHELTER_PREFIX: string = "/api/shelter";
// ARTICLE API PREFIX
export const API_ARTICLE_PREFIX: string = "/api/shelter";
// S3 API PREFIX
export const API_S3_PREFIX: string = "/api/s3";

// API ROUTES
// ANIMAL API ROUTES
// ADD NEW ANIMAL API ROUTE
export const API_NEW_ANIMAL: string = "/api/animal/new-animal";
// DELETE ANIMAL API ROUTE
export const API_DELETE_ANIMAL: string = "/api/animal/delete-animal";
// GET ANIMAL BY ID API ROUTE
export const API_GET_ANIMAL_BY_ID: string = "/api/animal/get-animal-by-id";
// GET USER ANIMALS BY USER ID API ROUTE
export const API_NEW_GET_USER_ANIMALS_BY_ID: string = "/api/animal/get-user-animals-by-id";
// GET ANIMALS BY PAGE API ROUTE
export const API_GET_ANIMALS_BY_PAGE: string = "/api/animal/get-all-animals-by-page";
// GET ALL ANIMAL FILTER OPTIONS API ROUTE
export const API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS: string = "/api/animal/get-all-animals-filters";
// GET USER ANIMALS BY PAGE BY USER ID API ROUTE
export const API_GET_BY_USER_ID_ANIMALS_BY_PAGE: string = "/api/animal/get-profile-animals-by-page";
// GET USER ANIMALS FILTER OPTIONS BY USER ID API ROUTE
export const API_GET_BY_USER_ID_ANIMALS_FILTER_OPTIONS: string = "/api/animal/get-profile-animals-filters";

// ARTICLE API ROUTES
// ADD NEW ARTICLE API ROUTE
export const API_NEW_ARTICLE: string = "/api/article/new-article";
// GET USER ARTICLE BY USER ID API ROUTE
export const API_NEW_GET_USER_ARTICLES_BY_ID: string = "/api/article/get-user-articles-by-id";
// EDIT ARTICLE API ROUTE
export const API_PUT_EDIT_ARTICLE: string = "/api/article/put-edit-article";
// GET ARTICLES BY PAGE API ROUTE
export const API_GET_ARTICLES_BY_PAGE: string = "/api/article/get-articles-by-page";
// GET ALL ARTICLE FILTER OPTIONS API ROUTE
export const API_GET_FILTER_OPTIONS_FOR_ALL_ARTICLES: string = "/api/article/get-filter-options-for-all-articles";

// SHELTER API ROUTES
// ADD NEW SHELTER API ROUTE
export const API_NEW_SHELTER: string = "/api/shelter/new-shelter";
// GET USER SHELTER BY USER ID API ROUTE
export const API_NEW_GET_USER_SHELTERS_BY_ID: string = "/api/shelter/get-user-shelters-by-id";
// EDIT SHELTER API ROUTE
export const API_PUT_EDIT_SHELTER: string = "/api/shelter/put-edit-shelter";
// GET SHELTERS BY PAGE API ROUTE
export const API_GET_SHELTERS_BY_PAGE: string = "/api/shelter/get-all-shelters-by-page";
// GET ALL SHELTER FILTER OPTIONS API ROUTE
export const API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS: string = "/api/shelter/get-all-shelters-filters";

// STATISTIC API ROUTES
// GET BIGGEST SHELTER IN EVERY STATE
export const API_GET_BIGGEST_SHELTER_IN_EVERY_STATE: string = "/api/statistics/get-biggest-shelter-in-every-state";

// USER API ROUTES
// GET USER BY TOKEN API ROUTE
export const API_USER_USER_BY_TOKEN: string = "/api/user/user-by-token";
// GET USER BY ID API ROUTE
export const API_USER_GET_USER_BY_ID: string = "/api/user/get-user-by-id";

// AUTH API ROUTES
// SIGN IN API ROUTE
export const API_AUTH_SIGN_IN: string = "/api/auth/sign-in";
// SIGN UP API ROUTE
export const API_AUTH_SIGN_UP: string = "/api/auth/sign-up";
// GOOGLE AUTH ROUTE
export const GOOGLE_AUTH_ROUTE: string = "/api/auth/sign-google";

// AWSS3 API ROUTES
// UPLOAD AVATAR API ROUTE
export const API_S3_UPLOAD_AVATAR: string = "/api/s3/upload-avatar";

// AWS SES
// SEND EMAIL MESSAGE
export const API_S3_SES_SEND_EMAIL: string = "/api/ses/send-email";

// LIST OF ROUTES
// PAGE ROUTES LIST
export const PAGE_ROUTES: string[] = [HOME_ROUTE, TERM_OF_USE_ROUTE, PRIVACY_POLICY_ROUTE, SIGN_IN_ROUTE, SIGN_UP_ROUTE, PROFILE_ROUTE, MY_PROFILE_ROUTE, ANIMAL_ROUTE, EDIT_ANIMAL_ROUTE, NEW_ANIMAL_ROUTE, ANIMALS_ROUTE, SHELTER_ROUTE, SHELTERS_ROUTE];
// API ROUTES LIST
export const API_ROUTES: string[] = [
	// ANIMAL API ROUTES
	API_NEW_ANIMAL,
	API_DELETE_ANIMAL,
	API_GET_ANIMAL_BY_ID,
	API_NEW_GET_USER_ANIMALS_BY_ID,
	API_GET_ANIMALS_BY_PAGE,
	API_GET_FILTER_OPTIONS_FOR_ALL_ANIMALS,
	API_GET_BY_USER_ID_ANIMALS_BY_PAGE,
	// ARTICLE API ROUTES
	API_NEW_ARTICLE,
	API_NEW_GET_USER_ARTICLES_BY_ID,
	API_GET_FILTER_OPTIONS_FOR_ALL_ARTICLES,
	API_GET_ARTICLES_BY_PAGE,
	API_PUT_EDIT_ARTICLE,
	// SHELTER API ROUTES
	API_NEW_SHELTER,
	API_NEW_GET_USER_SHELTERS_BY_ID,
	API_GET_FILTER_OPTIONS_FOR_ALL_SHELTERS,
	API_GET_SHELTERS_BY_PAGE,
	API_PUT_EDIT_SHELTER,
	// STATISTICS API ROUTES
	API_GET_BIGGEST_SHELTER_IN_EVERY_STATE,
	// USER API ROUTES
	API_USER_USER_BY_TOKEN,
	API_USER_GET_USER_BY_ID,
	// AUTH API ROUTES
	API_AUTH_SIGN_IN,
	API_AUTH_SIGN_UP,
	// GOOGLE AUTH API ROUTES
	GOOGLE_AUTH_ROUTE,
	// S3 API ROUTES
	API_S3_UPLOAD_AVATAR,
];
// AUTH ROUTES LIST
export const AUTH_ROUTES: string[] = [SIGN_IN_ROUTE, SIGN_UP_ROUTE, GOOGLE_AUTH_ROUTE];

// REDIRECTIONS
// SIGN IN SUCCESS REDIRECTION
export const SUCCESS_SIGN_IN_REDIRECTION: string = HOME_ROUTE;
// SIGN IN FAILED REDIRECTION
export const FAILED_SIGN_IN_REDIRECTION: string = SIGN_IN_ROUTE;
// SIGN UP SUCCESS REDIRECTION
export const SUCCESS_SIGN_UP_REDIRECTION: string = HOME_ROUTE;
// SIGN UP FAILED REDIRECTION
export const FAILED_SIGN_UP_REDIRECTION: string = SIGN_UP_ROUTE;
