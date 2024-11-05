export const urlSearchParamsBuilder = (
	params: Record<string, string | number | boolean | string[]>,
): URLSearchParams => {
	const urlSearchParams = new URLSearchParams();

	if (params && Object.keys(params).length) {
		Object.entries(params).forEach(([key, value]) => {
			if (typeof value === "string") {
				urlSearchParams.set(key, value);
			} else if (typeof value === "number") {
				// checking if number is not Infinity, -Infinity or NaN
				if (isFinite(value) && !isNaN(value)) {
					urlSearchParams.set(key, String(value));
				}
			} else if (typeof value === "boolean") {
				// will be passed only 'true' boolean
				if (value) {
					urlSearchParams.set(key, String(value));
				}
			} else if (Array.isArray(value)) {
				if (value.length) {
					value.forEach((value) => urlSearchParams.append(key, String(value)));
				}
			}
		});
	}

	return urlSearchParams;
};
