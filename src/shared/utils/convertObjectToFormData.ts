const convertObjectToFormData = (data: Record<string, unknown>): FormData => {
	const formData = new FormData();

	const appendToFormData = (key: string, value: unknown, parentKey?: string) => {
		const fullKey = parentKey ? (Number.isInteger(+key) ? `${parentKey}[${key}]` : `${parentKey}.${key}`) : key;

		if (value === null) {
			formData.append(fullKey, "__type_null__");
		} else if (value === undefined) {
			formData.append(fullKey, "__type_undefined__");
		} else if (value instanceof File || value instanceof Blob) {
			formData.append(fullKey, value);
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				appendToFormData(String(index), item, fullKey);
			});
		} else if (typeof value === "object" && value !== null) {
			Object.entries(value).forEach(([objKey, objValue]) => {
				appendToFormData(objKey, objValue, fullKey);
			});
		} else {
			formData.append(fullKey, `__type_${typeof value}__${value}`);
		}
	};

	Object.entries(data).forEach(([key, value]) => {
		appendToFormData(key, value);
	});

	return formData;
};

export default convertObjectToFormData;
