type LanguageLabel = {
	en: string;
	uk: string;
};

type DynamicValues = Record<string, { label: LanguageLabel }>;

export type SpeciesType = {
	label: LanguageLabel;
	breed: DynamicValues;
	sex: DynamicValues;
	size: DynamicValues;
};

// export type SpeciesType = {
// 	label: Record<string, string>;
// 	breed: Record<string, Record<string, string>>;
// 	sex: Record<string, Record<string, string>>;
// 	size: Record<string, Record<string, string>>;
// };
