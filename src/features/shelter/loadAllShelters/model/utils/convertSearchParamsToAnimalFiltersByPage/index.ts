// features
import AllSheltersFiltersByPageType from "@/features/shelter/loadAllShelters/model/types/AllSheltersFiltersByPageType";
// shared
import { validateToNaturalNumber } from "@/shared/utils/number";

const Index = (urlSearchParams: URLSearchParams): AllSheltersFiltersByPageType => {
	const query: AllSheltersFiltersByPageType = {};
	urlSearchParams.forEach((value, key) => {
		if (key === "page") {
			query[key] = validateToNaturalNumber(value);
		} else if (key === "state" || key === "city") {
			if (!query[key]) {
				query[key] = [];
			}
			query[key].push(value);
		}
	});
	return query;
};

export default Index;
