"use client";

// react
import { useEffect } from "react";
// shared
import { FormAutocompleteMultiselect } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import { Separator } from "@/shared/ui/separator";
import { Option } from "@/shared/formUi/formAutocompleteMiltiselect";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// next-intl
import { useTranslations } from "next-intl";
// features
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/shelter/loadAllSheltersFilters/model/type/filtersFormSchemaType";
import SelectedAllAnimalsFiltersFormValuesType from "@/features/shelter/loadAllSheltersFilters/model/type/selectedFiltersType";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/shelter/loadAllSheltersFilters/model/schema/filtersFormSchema";
import availableFiltersType from "@/features/shelter/loadAllSheltersFilters/model/type/availableFiltersType";

type availableOptionsListType = {
	state: Option[];
	city: Option[];
};

type Props = {
	availableOptions?: Omit<availableFiltersType, "sheltersList">;
	selectedValues?: SelectedAllAnimalsFiltersFormValuesType;
	onFilterChange: (value: SearchAllAnimalsFiltersFormSchemaType) => void;
};

const generateFormDefaultValue = (
	value?: SelectedAllAnimalsFiltersFormValuesType,
): SearchAllAnimalsFiltersFormSchemaType => ({
	state: value?.state || [],
	city: value?.city || [],
});

const generateFilterOptions = (optionsList: Omit<availableFiltersType, "sheltersList">) => {
	const availableOptionsList = {
		state: [],
		city: [],
	} as availableOptionsListType;

	Object.entries(optionsList).forEach(([key, value]) => {
		if (key === "state") {
			if (value) {
				availableOptionsList.state = (value as string[]).map((state) => ({
					values: [{ label: state, value: state }],
				}));
			}
		} else if (key === "city") {
			if (value) {
				availableOptionsList.city = Object.entries(value as Record<string, string[]>).map(
					([cityKey, cityValue]) => ({
						heading: { label: cityKey, value: cityKey },
						values: cityValue.map((city) => ({
							label: city,
							value: city,
						})),
					}),
				);
			}
		}
	});
	return availableOptionsList;
};

const FilterForm = ({ availableOptions, selectedValues, onFilterChange }: Props) => {
	const formattedOptions = availableOptions
		? generateFilterOptions(availableOptions)
		: {
				state: [],
				city: [],
			};
	const t = useTranslations();
	const form = useForm<SearchAllAnimalsFiltersFormSchemaType>({
		defaultValues: generateFormDefaultValue(selectedValues),
		resolver: zodResolver(SearchAllAnimalsFiltersFormSchema()),
	});

	const { watch, control, reset, getValues } = form;
	const formWatchState = watch("state");
	const formWatch = watch();
	const formValues = getValues();

	// to reset form valeus (useForm doesnt updating after re-render)
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
					name="state"
					options={formattedOptions?.state || []}
					emptyMessage={t("page.animals.state-autocomplete-multiselect-empty-dropdown-message")}
					placeholder={t("page.animals.state-autocomplete-multiselect-placeholder")}
				/>

				{formWatchState?.length ? (
					<FormAutocompleteMultiselect
						className="mb-4"
						control={control}
						name="city"
						disabled={!formWatchState?.length}
						options={formattedOptions?.city || []}
						emptyMessage={t("page.animals.city-autocomplete-multiselect-empty-dropdown-message")}
						placeholder={t("page.animals.city-autocomplete-multiselect-placeholder")}
					/>
				) : (
					<div className="mb-4 flex w-full items-center">
						<Separator className="flex-1" />
						<span className="px-4 text-center">{t("page.animals.select-state-for-more-filters")}</span>
						<Separator className="flex-1" />
					</div>
				)}
			</div>
		</Form>
	);
};

export default FilterForm;
