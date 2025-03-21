"use client";

// react
import { useEffect } from "react";
// shared
import { FormAutocompleteMultiselect } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import FormCheckbox from "@/shared/formUi/formCheckbox";
import { Separator } from "@/shared/ui/separator";
import { Option } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Button } from "@/shared/ui/button";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// next-intl
import { useTranslations } from "next-intl";
// features
import SearchAllAnimalsFiltersFormSchemaType from "@/features/animal/filterAllAnimals/model/type/filtersFormSchemaType";
import SelectedAllAnimalsFiltersFormValuesType from "@/features/animal/filterAllAnimals/model/type/selectedFiltersType";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/animal/filterAllAnimals/model/schema/filtersFormSchema";
import availableFiltersType from "@/features/animal/filterAllAnimals/model/type/availableFiltersType";

type availableOptionsListType = {
	species: Option[];
	breed: Option[];
	sex: Option[];
	size: Option[];
	state: Option[];
	city: Option[];
};

type Props = {
	availableOptions?: availableFiltersType;
	selectedValues?: SelectedAllAnimalsFiltersFormValuesType;
	onFilterChange?: (value: SearchAllAnimalsFiltersFormSchemaType) => void;
	onFilterSubmit?: (value: SearchAllAnimalsFiltersFormSchemaType) => void;
};

const generateFilterOptions = (optionsList: availableFiltersType) => {
	const availableOptionsList = {
		species: [],
		breed: [],
		sex: [],
		size: [],
		state: [],
		city: [],
	} as availableOptionsListType;

	Object.entries(optionsList).forEach(([key, value]) => {
		if (key === "species") {
			availableOptionsList.species = (value as string[]).map((species) => ({
				values: [{ label: species, value: species }],
			}));
		} else if (key === "state") {
			if (value) {
				availableOptionsList.state = (value as string[]).map((state) => ({
					values: [{ label: state, value: state }],
				}));
			}
		} else if (key === "breed") {
			availableOptionsList.breed = Object.entries(value as Record<string, string[]>).map(
				([breedKey, breedValue]) => ({
					heading: { label: breedKey, value: breedKey },
					values: breedValue.map((breed) => ({
						label: breed,
						value: breed,
					})),
				}),
			);
		} else if (key === "sex") {
			availableOptionsList.sex = Object.entries(value as Record<string, string[]>).map(([sexKey, sexValue]) => ({
				heading: { label: sexKey, value: sexKey },
				values: sexValue.map((sex) => ({
					label: sex,
					value: sex,
				})),
			}));
		} else if (key === "size") {
			availableOptionsList.size = Object.entries(value as Record<string, string[]>).map(
				([sizeKey, sizeValue]) => ({
					heading: { label: sizeKey, value: sizeKey },
					values: sizeValue.map((size) => ({
						label: size,
						value: size,
					})),
				}),
			);
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

const Index = ({ availableOptions, selectedValues, onFilterChange, onFilterSubmit }: Props) => {
	const formattedOptions = availableOptions
		? generateFilterOptions(availableOptions)
		: {
				species: [],
				breed: [],
				sex: [],
				size: [],
				state: [],
				city: [],
			};
	const t = useTranslations();
	const form = useForm<SearchAllAnimalsFiltersFormSchemaType>({
		defaultValues: {
			species: selectedValues?.species || [],
			breed: selectedValues?.breed || [],
			sex: selectedValues?.sex || [],
			size: selectedValues?.size || [],
			state: selectedValues?.state || [],
			city: selectedValues?.city || [],
			injury: selectedValues?.injury || false,
			sterilized: selectedValues?.sterilized || false,
		},
		resolver: zodResolver(SearchAllAnimalsFiltersFormSchema()),
	});

	const { watch, control, reset, getValues, handleSubmit, formState } = form;
	const formWatchSpecies = watch("species");
	const formWatchState = watch("state");
	const formWatch = watch();
	const formValues = getValues();

	// to reset form values (useForm doesnt updating after re-render)
	useEffect(() => {
		reset(selectedValues);
	}, [selectedValues]);

	useEffect(() => {
		// onFilterChange && onFilterChange(formValues);
	}, [formWatch]);

	const onHandleSubmit = (values: SearchAllAnimalsFiltersFormSchemaType) => {
		onFilterSubmit && onFilterSubmit(values);
	};

	useEffect(() => {
		onFilterChange && onFilterChange(formValues);
		reset(formValues);
	}, [formState.isDirty]);

	return (
		<Form {...form}>
			<form className="space-y-8" onSubmit={handleSubmit(onHandleSubmit)}>
				<div className="space-y-4">
					<FormAutocompleteMultiselect
						className="mb-4"
						control={control}
						name="species"
						options={formattedOptions?.species || []}
						emptyMessage={t("page.animals.species-autocomplete-multiselect-empty-dropdown-message")}
						placeholder={t("page.animals.species-autocomplete-multiselect-placeholder")}
					/>

					{formWatchSpecies && formWatchSpecies.length ? (
						<>
							<FormAutocompleteMultiselect
								className="mb-4"
								control={control}
								name="breed"
								disabled={!formWatchSpecies.length}
								options={formattedOptions?.breed || []}
								emptyMessage={t("page.animals.breed-autocomplete-multiselect-empty-dropdown-message")}
								placeholder={t("page.animals.breed-autocomplete-multiselect-placeholder")}
							/>
							<FormAutocompleteMultiselect
								className="mb-4"
								control={control}
								name="sex"
								disabled={!formWatchSpecies.length}
								options={formattedOptions?.sex || []}
								emptyMessage={t("page.animals.sex-autocomplete-multiselect-empty-dropdown-message")}
								placeholder={t("page.animals.sex-autocomplete-multiselect-placeholder")}
							/>
							<FormAutocompleteMultiselect
								className="mb-4"
								control={control}
								name="size"
								disabled={!formWatchSpecies.length}
								options={formattedOptions?.size || []}
								emptyMessage={t("page.animals.size-autocomplete-multiselect-empty-dropdown-message")}
								placeholder={t("page.animals.size-autocomplete-multiselect-placeholder")}
							/>
						</>
					) : (
						<div className="mb-4 flex w-full items-center">
							<Separator className="flex-1" />
							<span className="px-4 text-center">
								{t("page.animals.select-species-for-more-filters")}
							</span>
							<Separator className="flex-1" />
						</div>
					)}

					<FormCheckbox
						className="mb-4"
						control={control}
						name="sterilized"
						label={t("page.animals.sterilization-checkbox-label")}
					/>

					<FormCheckbox
						className="mb-4"
						control={control}
						name="injury"
						label={t("page.animals.injury-checkbox-label")}
					/>

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
				<Button type="submit">{t("page.animals.search")}</Button>
			</form>
		</Form>
	);
};

export default Index;
