const getAgeInMonths = (date: Date): number => {
	const currentDate = new Date();
	const years = currentDate.getFullYear() - date.getFullYear();
	const months = currentDate.getMonth() - date.getMonth();
	const days = currentDate.getDate() - date.getDate();

	let totalMonths = years * 12 + months;

	if (days < 0) {
		totalMonths -= 1;
	}

	return totalMonths;
};

export default getAgeInMonths;
