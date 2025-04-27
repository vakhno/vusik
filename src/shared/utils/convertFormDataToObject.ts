const convertFormDataToObject = (formData: FormData): Record<string, unknown> => {
	const data: Record<string, unknown> = {};

	const setValue = (key: (string | number)[], value: string | File | Blob) => {
		let current = data;

		key.slice(0, -1).forEach((part, i) => {
			const nextPart = key[i + 1];
			if (typeof nextPart === "number") {
				current[part] = current[part] || [];
			} else {
				current[part] = current[part] || {};
			}
			current = current[part] as Record<string, unknown>;
		});

		const finalKey = key[key.length - 1];

		if (value instanceof File || value instanceof Blob) {
			current[finalKey] = value;
		} else if (value === "__type_null__") {
			current[finalKey] = null;
		} else if (value === "__type_undefined__") {
			current[finalKey] = undefined;
		} else if (value.startsWith("__type_string__")) {
			current[finalKey] = value.replace("__type_string__", "");
		} else if (value.startsWith("__type_number__")) {
			current[finalKey] = Number(value.replace("__type_number__", ""));
		} else if (value.startsWith("__type_boolean__")) {
			if (value.replace("__type_boolean__", "") === "true") {
				current[finalKey] = true;
			} else if (value.replace("__type_boolean__", "") === "false") {
				current[finalKey] = false;
			}
		}
	};

	const parseKey = (key: string): (string | number)[] => {
		const parts: (string | number)[] = [];

		const splitSegments = (str: string): string[] => {
			const segments: string[] = [];
			let current = "";
			let inBrackets = false;

			str.split("").forEach((char) => {
				if (char === "." && !inBrackets) {
					if (current) {
						segments.push(current);
						current = "";
					}
				} else if (char === "[" && !inBrackets) {
					if (current) {
						segments.push(current);
						current = "";
					}
					inBrackets = true;
					current += char;
				} else if (char === "]" && inBrackets) {
					current += char;
					segments.push(current);
					current = "";
					inBrackets = false;
				} else {
					current += char;
				}
			});

			if (current) {
				segments.push(current);
			}

			return segments;
		};

		splitSegments(key).forEach((segment) => {
			if (segment.startsWith("[") && segment.endsWith("]")) {
				const indexStr = segment.slice(1, -1);
				if (/^\d+$/.test(indexStr)) {
					parts.push(parseInt(indexStr, 10));
				} else {
					parts.push(segment);
				}
			} else {
				parts.push(segment);
			}
		});

		return parts;
	};

	Array.from(formData.entries()).forEach(([key, value]) => {
		const parsedKey = parseKey(key);
		setValue(parsedKey, value);
	});

	return data;
};

export default convertFormDataToObject;
