// tanstack
import { useQuery, QueryClient } from "@tanstack/react-query";

type Props = {
	articleId: string;
};

export const queryArticle = ({ articleId }: Props) => {
	return useQuery({
		queryKey: ["article", articleId],
		queryFn: async () => {
			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.set("id", articleId);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/get-article-by-id/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);
				const { ok } = response;
				if (ok) {
					const data = await response.json();
					const { success } = data;
					if (success) {
						const { article } = data;

						return article;
					}
				}
				return null;
			} catch (_) {
				return null;
			}
		},
	});
};

export const queryPrefetchArticle = async ({ articleId }: Props) => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["article", articleId],
		queryFn: async () => {
			try {
				const urlSearchParams = new URLSearchParams();
				urlSearchParams.set("id", articleId);
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/article/get-article-by-id/?${urlSearchParams}`,
					{
						method: "GET",
					},
				);
				const { ok } = response;
				if (ok) {
					const data = await response.json();
					const { success } = data;

					if (success) {
						const { article } = data;

						return article;
					}
				}
				return null;
			} catch (_) {
				return null;
			}
		},
	});

	return queryClient;
};

// export const useQueryProfileMutation = ({ userId }: Props) => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: (userId: Types.ObjectId) => getUserById({ userId: userId }),
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
// 		},
// 	});
// };
