export const getFilterOptionsForAllAnimals = async () => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-filter-options-for-all-animals`,
			{
				method: "GET",
			},
		);

		const result = await response.json();
		const { success } = result;

		if (success) {
			const { options } = result;
			return options;
		} else {
			return false;
		}
	} catch (_) {
		return false;
	}
};
