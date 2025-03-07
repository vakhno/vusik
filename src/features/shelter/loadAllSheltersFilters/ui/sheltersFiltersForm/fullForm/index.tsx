"use client";

// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// features
import { SearchAllAnimalsFiltersFormSchemaType } from "@/features/shelter/loadAllSheltersFilters/model/type/filtersFormSchemaType";
import SelectedAllAnimalsFiltersFormValuesType from "@/features/shelter/loadAllSheltersFilters/model/type/selectedFiltersType";
import { SearchAllAnimalsFiltersFormSchema } from "@/features/shelter/loadAllSheltersFilters/model/schema/filtersFormSchema";
import FilterForm from "@/features/shelter/loadAllSheltersFilters/ui/sheltersFiltersForm/filtersFields";
import OrderForm from "@/features/shelter/loadAllSheltersFilters/ui/sheltersFiltersForm/sortFields";
import Map from "@/features/shelter/loadAllSheltersFilters/ui/sheltersFiltersForm/sheltersMap";
import availableFiltersType from "@/features/shelter/loadAllSheltersFilters/model/type/availableFiltersType";
// next-intl
import { useTranslations } from "next-intl";
// shared
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Form } from "@/shared/ui/form";
// widgets
import { MarkerCoordinates } from "@/widget/googleMap/map";

type Props = {
	className?: string;
	shelterMarkers: MarkerCoordinates[];
	availableOptions: Omit<availableFiltersType, "sheltersList">;
	selectedValues: SelectedAllAnimalsFiltersFormValuesType;
	handleFilterChange: (value: SearchAllAnimalsFiltersFormSchemaType) => void;
};

const generateFormDefaultValue = (
	value: SelectedAllAnimalsFiltersFormValuesType,
): SearchAllAnimalsFiltersFormSchemaType => ({
	state: value?.state || [],
	city: value?.city || [],
});

const Index = ({ className = "", shelterMarkers, availableOptions, selectedValues, handleFilterChange }: Props) => {
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
				<Map shelterMarkers={shelterMarkers} />
			</form>
		</Form>
	);
};

export default Index;
