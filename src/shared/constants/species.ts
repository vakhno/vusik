// export const species = {
// 	dog: {
// 		value: "dog",
// 		breed: ["dog_metis", "dog_bulldog", "dog_poodle", "dog_corgi", "dog_german-shepherd"],
// 		sex: ["boy", "girl"],
// 		size: ["small", "medium", "large"],
// 	},
// 	cat: {
// 		value: "cat",
// 		breed: ["cat_metis", "cat_ragdoll", "cat_siamese"],
// 		sex: ["boy", "girl"],
// 		size: ["small", "medium", "large"],
// 	},
// };

export const species = {
	dog: {
		label: { en: "Dog", uk: "Собака" },
		breed: {
			dog_metis: { label: { en: "Metis", uk: "Метис" } },
			dog_bulldog: { label: { en: "Bulldog", uk: "Бульдог" } },
			dog_poodle: { label: { en: "Poodle", uk: "Пудель" } },
			dog_corgi: { label: { en: "Corgi", uk: "Коргі" } },
			dog_german_shepherd: { label: { en: "German Shepherd", uk: "Німецька вівчарка" } },
		},
		sex: {
			dog_boy: { label: { en: "Boy", uk: "Хлопчик" } },
			dog_girl: { label: { en: "Girl", uk: "Дівчинка" } },
		},
		size: {
			dog_young: { label: { en: "Puppy", uk: "Цуценя" } },
			dog_small: { label: { en: "Adult and Small", uk: "Дорослий та Маленький" } },
			dog_medium: { label: { en: "Adult and Medium", uk: "Дорослий та Середній" } },
			dog_large: { label: { en: "Adult and Large", uk: "Дорослий та Великий" } },
		},
	},
	cat: {
		label: { en: "Cat", uk: "Кішка" },
		breed: {
			cat_metis: { label: { en: "Metis", uk: "Метис" } },
			cat_ragdoll: { label: { en: "Ragdoll", uk: "Регдолл" } },
			cat_siamese: { label: { en: "Siamese", uk: "Сіамська" } },
		},
		sex: {
			cat_boy: { label: { en: "Boy", uk: "Хлопчик" } },
			cat_girl: { label: { en: "Girl", uk: "Дівчинка" } },
		},
		size: {
			cat_young: { label: { en: "Kitten", uk: "Кошеня" } },
			cat_small: { label: { en: "Adult and Small", uk: "Дорослий та Маленький" } },
			cat_medium: { label: { en: "Adult and Medium", uk: "Дорослий та Середній" } },
			cat_large: { label: { en: "Adult and Large", uk: "Дорослий та Великий" } },
		},
	},
};
