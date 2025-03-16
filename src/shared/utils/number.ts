export const validateToNaturalNumber = (value: string | number): number => {
	value = Number(value);

	if (!isNaN(value) && isFinite(value) && Math.floor(value) > 0) {
		return Math.floor(value);
	}

	return 1;
};
