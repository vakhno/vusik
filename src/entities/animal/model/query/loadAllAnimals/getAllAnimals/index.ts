// tanstack
import { QueryClient } from "@tanstack/react-query";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";

type InvalidationProps = {
	queryClient: QueryClient;
	searchParams: SearchParamsType;
};

export const queryGetAllAnimalsInvalidate = ({ queryClient, searchParams }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-animals", JSON.stringify(searchParams)] });
};
