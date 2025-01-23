import { FormAutocompleteMultiselect, Option } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ArticleSearchSchema } from "@/entities/article/model/schema/articleSearch";
import { ArticleSearchSchemaType } from "@/entities/article/model/type/articleSearch";
import { Button } from "@/shared/ui/button";
import { useEffect, useMemo, useState } from "react";
import { SearchParamsType } from "@/types/searchParams.type";
import { queryGetProfileArticlesFilter } from "@/entities/article/model/query/articlesAllByPageProfileFilters";
import { Types } from "mongoose";

type Props = {
	userId: Types.ObjectId;
	className?: string;
	searchParams: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	filterChage: (values: SearchParamsType) => void;
};

const Index = ({ userId, className = "", searchParams, filterChage }: Props) => {
	const t = useTranslations();
	const { data: dataOptions } = queryGetProfileArticlesFilter({
		searchParams: searchParams,
		id: userId,
	});
	// list of filter full available options
	const [articleFiltersOptionList, setArticleFiltersOptionList] = useState<
		Partial<Record<keyof ArticleSearchSchemaType, Option[]>>
	>({
		category: [],
	});
	// list of selected options
	const [articleFiltersDefaultOptions, setArticleFiltersDefaultOptions] = useState<
		Partial<Record<keyof ArticleSearchSchemaType, string[]>>
	>({
		category: [],
	});

	const articleSearchSchema = ArticleSearchSchema();
	const form = useForm<z.infer<typeof articleSearchSchema>>({
		defaultValues: {
			category: articleFiltersDefaultOptions?.category || [],
		},
		resolver: zodResolver(articleSearchSchema),
	});

	// list of selected/available options memoizations
	useMemo(() => {
		if (!dataOptions) return;
		const defaultFilterOptions = {
			city: [],
			state: [],
		} as Partial<Record<keyof ArticleSearchSchemaType, string[]>>;
		const filterOptionsList = {
			city: [],
			state: [],
		} as Partial<Record<keyof ArticleSearchSchemaType, Option[]>>;

		const { availableOptions, selectedOptions } = dataOptions as {
			availableOptions: Record<keyof ArticleSearchSchemaType, string[]>;
			selectedOptions: Record<keyof ArticleSearchSchemaType, string[]>;
		};
		// filling selected options
		Object.entries(selectedOptions).forEach(([key, value]) => {
			if (key === "category") {
				defaultFilterOptions.category = value as string[];
			}
		});
		// filling available options
		Object.entries(availableOptions).forEach(([key, value]) => {
			if (key === "category") {
				filterOptionsList.category = value.map((categoryValue) => ({
					values: [{ label: categoryValue, value: categoryValue }],
				})) as Option[];
			}
		});

		// form.setValue("species", defaultFilterOptions?.species || []);
		setArticleFiltersDefaultOptions(defaultFilterOptions);
		setArticleFiltersOptionList(filterOptionsList);
	}, [dataOptions]);

	useEffect(() => {
		form.reset(articleFiltersDefaultOptions);
	}, [articleFiltersDefaultOptions]);

	const handleFilterChange = async (values: ArticleSearchSchemaType) => {
		const preparedAnimalSeachParams = Object.fromEntries(
			Object.entries(values).map(([key, value]) =>
				key === "injury" || key === "sterilized" ? [key, String(value)] : [key, value],
			),
		);
		filterChage(preparedAnimalSeachParams);
	};

	const onSubmit = async (values: ArticleSearchSchemaType) => {
		handleFilterChange(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-8 ${className}`}>
				<FormAutocompleteMultiselect
					control={form.control}
					name="category"
					options={articleFiltersOptionList?.category || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-species")}
				/>

				<Button type="submit" className="my-8 w-full justify-center">
					{t("search")}
				</Button>
			</form>
		</Form>
	);
};

export default Index;
