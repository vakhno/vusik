export const validateToNaturalNumber = (value: string | number): number => {
	value = Number(value);

	if (!isNaN(value) && isFinite(value) && Math.floor(value) > 0) {
		return Math.floor(value);
	}

	return 1;
};

export const validateToFloatNumber = (value: string | number): number => {
	value = Number(value);

	if (!isNaN(value) && isFinite(value) && value > 0) {
		return Number(value.toFixed(2));
	}

	return 1;
};

export const isNumberValid = (value: string | number): boolean => {
	const numValue = Number(value);

	return !isNaN(numValue) && isFinite(numValue) && numValue >= 0;
};
