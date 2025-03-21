const Index = (urlSearchParams: URLSearchParams): Record<string, string[]> => {
	const searchParams = {} as Record<string, string[]>;

	Array.from(urlSearchParams).forEach(([key, value]) => {
		if (key in searchParams) {
			searchParams[key] = [...searchParams[key], value];
		} else {
			searchParams[key] = [value];
		}
	});

	return searchParams;
};

export default Index;
