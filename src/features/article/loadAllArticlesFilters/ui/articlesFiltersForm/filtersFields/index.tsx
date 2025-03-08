"use client";

// react
import { useEffect } from "react";
// shared
import { FormAutocompleteMultiselect } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import { Option } from "@/shared/formUi/formAutocompleteMiltiselect";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// next-intl
import { useTranslations } from "next-intl";
// features
import { SearchAllArticlesFiltersFormSchemaType } from "@/features/article/loadAllArticlesFilters/model/type/filtersFormSchemaType";
import SelectedAllArticlesFiltersFormValuesType from "@/features/article/loadAllArticlesFilters/model/type/selectedFiltersType";
import { SearchAllArticlesFiltersFormSchema } from "@/features/article/loadAllArticlesFilters/model/schema/filtersFormSchema";
import availableFiltersType from "@/features/article/loadAllArticlesFilters/model/type/availableFiltersType";

type availableOptionsListType = {
	category: Option[];
};

type Props = {
	availableOptions?: availableFiltersType;
	selectedValues?: SelectedAllArticlesFiltersFormValuesType;
	onFilterChange: (value: SearchAllArticlesFiltersFormSchemaType) => void;
};

const generateFormDefaultValue = (
	value?: SelectedAllArticlesFiltersFormValuesType,
): SearchAllArticlesFiltersFormSchemaType => ({
	category: value?.category || [],
});

const generateFilterOptions = (optionsList: availableFiltersType) => {
	const availableOptionsList = {
		category: [],
	} as availableOptionsListType;

	Object.entries(optionsList).forEach(([key, value]) => {
		if (key === "category") {
			if (value) {
				availableOptionsList.category = (value as string[]).map((category) => ({
					values: [{ label: category, value: category }],
				}));
			}
		}
	});
	return availableOptionsList;
};

const Index = ({ availableOptions, selectedValues, onFilterChange }: Props) => {
	const formattedOptions = availableOptions
		? generateFilterOptions(availableOptions)
		: {
				category: [],
			};
	const t = useTranslations();
	const form = useForm<SearchAllArticlesFiltersFormSchemaType>({
		defaultValues: generateFormDefaultValue(selectedValues),
		resolver: zodResolver(SearchAllArticlesFiltersFormSchema()),
	});

	const { watch, control, reset, getValues } = form;
	const formWatch = watch();
	const formValues = getValues();

	// to reset form values (useForm doesnt updating after re-render)
	useEffect(() => {
		reset(selectedValues);
	}, [selectedValues]);

	useEffect(() => {
		onFilterChange(formValues);
	}, [formWatch]);

	return (
		<Form {...form}>
			<div className="space-y-4">
				<FormAutocompleteMultiselect
					className="z-[100] mb-4"
					control={control}
					name="category"
					options={formattedOptions?.category || []}
					emptyMessage={t("page.animals.state-autocomplete-multiselect-empty-dropdown-message")}
					placeholder={t("page.animals.state-autocomplete-multiselect-placeholder")}
				/>
			</div>
		</Form>
	);
};

export default Index;
