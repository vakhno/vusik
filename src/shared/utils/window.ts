export const windowHistoryPush = (urlSearchParams: URLSearchParams): void => {
	// using window.history.pushState instead of router.push, because useRouter from next/navigation doesnt contain shallow (shallow: true to disable page refreshing after router.push)
	window.history.pushState(
		null,
		"",
		urlSearchParams.size ? `?${String(urlSearchParams)}` : window.location.pathname + window.location.hash,
	);
};
