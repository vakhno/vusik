import { useRouter } from "next/navigation";
import { windowHistoryPush } from "@/utils/window";

export const useWindowHistoryPush = () => {
	const router = useRouter();

	return (urlSearchParams: URLSearchParams) => {
		windowHistoryPush(urlSearchParams);
		router.replace(window.location.pathname + window.location.search, { scroll: false });
	};
};
