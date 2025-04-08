import { TFunction } from "@/shared/types/nextIntl.type";

type Props = {
	ageInMonths: number;
	t: TFunction;
};

const generateAgeLabel = ({ ageInMonths, t }: Props): string => {
	if (ageInMonths < 12) {
		return t("age.months", { count: ageInMonths });
	}

	const years = Math.floor((ageInMonths - 12) / 6) + 1;
	return t("age.years", { count: years });
};

export default generateAgeLabel;
