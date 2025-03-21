// features
import FiltersFormSchemaType from "@/features/animal/filterAllAnimals/model/type/filtersFormSchemaType";

const Index = (urlSearchParams: URLSearchParams): FiltersFormSchemaType => {
	const query: FiltersFormSchemaType = {};
	urlSearchParams.forEach((value, key) => {
		if (key === "injury" || key === "sterilized") {
			query[key] = value === "true";
		} else if (
			key === "state" ||
			key === "city" ||
			key === "species" ||
			key === "breed" ||
			key === "sex" ||
			key === "size"
		) {
			query[key] = Array.from(new Set(value.split(",")));
		}
	});
	return query;
};

export default Index;
