// mongoose
import { ShelterType } from "@/entities/shelter/@x/animal";

export type FiltersPopulatedAnimalsType = {
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
	shelters: [ShelterType];
};

export type FiltersPopulatedSheltersType = {
	shelters: [ShelterType];
	states: Record<string, number>;
	cities: Record<string, number>;
};

export type FiltersPopulatedUserType = {
	animals: FiltersPopulatedAnimalsType;
	shelters: FiltersPopulatedSheltersType;
};

export type FiltersPopulatedUsersType = Record<string, FiltersPopulatedUserType>;

export type FiltersPopulatedType = {
	animals: FiltersPopulatedAnimalsType;
	shelters: FiltersPopulatedSheltersType;
	users: FiltersPopulatedUsersType;
};
