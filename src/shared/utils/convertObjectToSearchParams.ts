import { SearchParamsType } from "@/shared/types/searchParams.type";

const Index = (params: Record<string, string | number | boolean | string[] | undefined | null>): SearchParamsType => {
	const result: SearchParamsType = {};

	if (!params || !Object.keys(params).length) return result;

	Object.entries(params).forEach(([key, value]) => {
		if (typeof value === "string") {
			result[key] = value;
		} else if (typeof value === "number") {
			if (isFinite(value) && !isNaN(value)) {
				result[key] = String(value);
			}
		} else if (typeof value === "boolean") {
			if (value) {
				result[key] = String(value);
			}
		} else if (Array.isArray(value)) {
			if (value.length) {
				result[key] = value.map((item) => String(item));
			}
		}
	});

	return result;
};

export default Index;
