// tanstack
import { QueryClient } from "@tanstack/react-query";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";

type InvalidationProps = {
	queryClient: QueryClient;
	searchParams: SearchParamsType;
};

export const queryGetAllSheltersInvalidate = ({ queryClient, searchParams }: InvalidationProps) => {
	queryClient.invalidateQueries({ queryKey: ["all-shelters", JSON.stringify(searchParams)] });
};
