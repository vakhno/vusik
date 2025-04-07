// mongoose
import { Types } from "mongoose";

export type FiltersAnimalsType = {
	species: Record<
		string,
		{
			breeds: Record<string, number>;
			size: Record<string, number>;
			birthday: Record<string, number>;
			sex: Record<string, number>;
		}
	>;
	states: Record<string, number>;
	cities: Record<string, number>;
	shelters: [Types.ObjectId];
};

export type FiltersSheltersType = {
	shelters: [Types.ObjectId];
	states: Record<string, number>;
	cities: Record<string, number>;
};

export type FiltersArticlesType = {
	categories: Record<string, number>;
};

export type FiltersUserType = {
	animals: FiltersAnimalsType;
	shelters: FiltersSheltersType;
	articles: FiltersArticlesType;
};

export type FiltersUsersType = Record<string, FiltersUserType>;

export type FiltersType = {
	animals: FiltersAnimalsType;
	shelters: FiltersSheltersType;
	articles: FiltersArticlesType;
	users: FiltersUsersType;
};
