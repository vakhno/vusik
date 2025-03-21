"use client";

// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// features
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/animal/loadProfileAnimalsFilters/model/type/filtersFormSchemaType";
import SelectedAllAnimalsFiltersFormValuesType from "@/features/animal/loadProfileAnimalsFilters/model/type/selectedFiltersType";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/animal/loadProfileAnimalsFilters/model/schema/filtersFormSchema";
import FilterForm from "@/features/animal/loadProfileAnimalsFilters/ui/animalsFiltersForm/filtersFields";
import OrderForm from "@/features/animal/loadProfileAnimalsFilters/ui/animalsFiltersForm/sortFields";
import Map from "@/features/animal/loadProfileAnimalsFilters/ui/animalsFiltersForm/sheltersMap";
import availableFiltersType from "@/features/animal/loadProfileAnimalsFilters/model/type/availableFiltersType";
// next-intl
import { useTranslations } from "next-intl";
// shared
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Form } from "@/shared/ui/form";
// widgets
import { MarkerCoordinates } from "@/shared/shared/GoogleMap";

type Props = {
	className?: string;
	shelterMarkers?: MarkerCoordinates[];
	availableOptions: Omit<availableFiltersType, "sheltersList">;
	selectedValues: SelectedAllAnimalsFiltersFormValuesType;
	handleFilterChange: (value: SearchAllAnimalsFiltersFormSchemaType) => void;
};

const generateFormDefaultValue = (
	value: SelectedAllAnimalsFiltersFormValuesType,
): SearchAllAnimalsFiltersFormSchemaType => ({
	species: value?.species || [],
	breed: value?.breed || [],
	sex: value?.sex || [],
	size: value?.size || [],
	state: value?.state || [],
	city: value?.city || [],
	injury: value?.injury || false,
	sterilized: value?.sterilized || false,
});

const SearchAnimalForm = ({ className = "", availableOptions, selectedValues, handleFilterChange }: Props) => {
	const t = useTranslations();
	const form = useForm<SearchAllAnimalsFiltersFormSchemaType>({
		defaultValues: generateFormDefaultValue(selectedValues),
		resolver: zodResolver(SearchAllAnimalsFiltersFormSchema()),
	});

	return (
		<Form {...form}>
			<form className={`space-y-8 ${className}`}>
				<Accordion type="multiple" defaultValue={["filters"]}>
					<AccordionItem value="filters">
						<AccordionTrigger>{t("page.animals.filtering-accordion-tab")}</AccordionTrigger>
						<AccordionContent>
							<FilterForm
								availableOptions={availableOptions}
								selectedValues={selectedValues}
								onFilterChange={handleFilterChange}
							/>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="sort">
						<AccordionTrigger>{t("page.animals.sorting-accordion-tab")}</AccordionTrigger>
						<AccordionContent>
							<OrderForm />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<Map />
			</form>
		</Form>
	);
};

export default SearchAnimalForm;
