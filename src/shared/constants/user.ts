// ADMIN - access to statistics, ability to change labels, ability to delete users, shelters and etc.
// MODERATOR - access to statistics.
// OWNER - user that created profile by his own
export const UserRole = {
	ADMINISTRATOR: "admin",
	MODERATOR: "moderator",
	OWNER: "owner",
} as const;
