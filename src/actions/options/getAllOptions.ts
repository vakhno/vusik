"use server";

type Result = [] | null;

export const getAllOptions = async (): Promise<Result> => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/animal/get-filter-options-for-all-animals`,
			{
				method: "GET",
			},
		);

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;

			if (success) {
				const { options } = data;

				return options;
			} else {
				return null;
			}
		} else {
			return null;
		}
	} catch (_) {
		return null;
	}
};
