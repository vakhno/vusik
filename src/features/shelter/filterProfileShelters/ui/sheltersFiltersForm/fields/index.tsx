"use client";

// react
import { useEffect } from "react";
// shared
import { FormAutocompleteMultiselect } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Separator } from "@/shared/ui/separator";
import { Option } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// next-intl
import { useTranslations } from "next-intl";
// features
import SearchAllSheltersFiltersFormSchemaType from "@/features/shelter/filterAllShelters/model/type/filtersFormSchemaType";
import SelectedAllAnimalsFiltersFormValuesType from "@/features/shelter/filterAllShelters/model/type/selectedFiltersType";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/shelter/filterAllShelters/model/schema/filtersFormSchema";
import availableFiltersType from "@/features/shelter/filterAllShelters/model/type/availableFiltersType";

type availableOptionsListType = {
    state: Option[];
    city: Option[];
};

type Props = {
    availableOptions?: Omit<availableFiltersType, "sheltersList">;
    selectedValues?: SelectedAllAnimalsFiltersFormValuesType;
    onFilterChange?: (value: SearchAllSheltersFiltersFormSchemaType) => void;
    onFilterSubmit?: (value: SearchAllSheltersFiltersFormSchemaType) => void;
};

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
                availableOptionsList.city = Object.entries(value as Record<string, string[]>).map(([cityKey, cityValue]) => ({
                    heading: { label: cityKey, value: cityKey },
                    values: cityValue.map((city) => ({
                        label: city,
                        value: city,
                    })),
                }));
            }
        }
    });
    return availableOptionsList;
};

const FilterForm = ({ availableOptions, selectedValues, onFilterChange, onFilterSubmit }: Props) => {
    const formattedOptions = availableOptions
        ? generateFilterOptions(availableOptions)
        : {
                state: [],
                city: [],
            };
    const t = useTranslations();
    const form = useForm<SearchAllSheltersFiltersFormSchemaType>({
        defaultValues: {
            state: selectedValues?.state || [],
            city: selectedValues?.city || [],
        },
        resolver: zodResolver(SearchAllAnimalsFiltersFormSchema()),
    });

    const { watch, control, reset, getValues, handleSubmit, formState } = form;
    const { isDirty } = formState;
    const formWatchState = watch("state");
    const formValues = getValues();

    // to reset form valeus (useForm doesnt updating after re-render)
    useEffect(() => {
        reset(selectedValues);
    }, [selectedValues]);

    // whenever a field is changed, it mean an edit, so field its triggering a change
    useEffect(() => {
        onFilterChange && onFilterChange(formValues);
        reset(formValues);
    }, [isDirty]);

    const onHandleSubmit = (values: SearchAllSheltersFiltersFormSchemaType) => {
        onFilterSubmit && onFilterSubmit(values);
    };

    return (
        <Form {...form}>
            <form className="mb-4 space-y-4" onSubmit={handleSubmit(onHandleSubmit)}>
                <div className="space-y-4">
                    <FormAutocompleteMultiselect className="z-[100] mb-4" control={control} name="state" options={formattedOptions?.state || []} emptyMessage={t("page.shelters.state-autocomplete-multiselect-empty-dropdown-message")} placeholder={t("page.shelters.state-autocomplete-multiselect-placeholder")} />

                    {formWatchState?.length ? (
                        <FormAutocompleteMultiselect className="mb-4" control={control} name="city" disabled={!formWatchState?.length} options={formattedOptions?.city || []} emptyMessage={t("page.shelters.city-autocomplete-multiselect-empty-dropdown-message")} placeholder={t("page.shelters.city-autocomplete-multiselect-placeholder")} />
                    ) : (
                        <div className="mb-4 flex w-full items-center">
                            <Separator className="flex-1" />
                            <span className="px-4 text-center">{t("page.shelters.select-state-for-more-filters")}</span>
                            <Separator className="flex-1" />
                        </div>
                    )}
                </div>
                <Button className="w-full" type="submit">
                    {t("page.shelters.search")}
                </Button>
            </form>
        </Form>
    );
};

export default FilterForm;
