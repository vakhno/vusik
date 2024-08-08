export type UserType = {
	_id: string;
	email: string;
	password?: string;
	avatar: string;
	name: string;
	isSocial: boolean;
	createdAt: Date;
	updatedAt: Date;
};
