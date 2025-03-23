// features
import AnimalFiltersByPageType from "@/features/animal/loadAllAnimals/model/types/AnimalFiltersByPageType";
import { validateToNaturalNumber } from "@/shared/utils/number";

const Index = (urlSearchParams: URLSearchParams): AnimalFiltersByPageType => {
	const query: AnimalFiltersByPageType = {};
	urlSearchParams.forEach((value, key) => {
		if (key === "injury" || key === "sterilized") {
			query[key] = value === "true";
		} else if (key === "page") {
			query[key] = validateToNaturalNumber(value);
		} else if (
			key === "state" ||
			key === "city" ||
			key === "species" ||
			key === "breed" ||
			key === "sex" ||
			key === "size"
		) {
			if (!query[key]) {
				query[key] = [];
			}
			query[key].push(value);
		}
	});
	return query;
};

export default Index;
