"use client";

// zod
import { zodResolver } from "@hookform/resolvers/zod";
// react-hook-form
import { useForm } from "react-hook-form";
// features
import { SearchAllArticlesFiltersFormSchemaType } from "@/features/article/loadAllArticlesFilters/model/type/filtersFormSchemaType";
import SelectedAllArticlesFiltersFormValuesType from "@/features/article/loadAllArticlesFilters/model/type/selectedFiltersType";
import { SearchAllArticlesFiltersFormSchema } from "@/features/article/loadAllArticlesFilters/model/schema/filtersFormSchema";
import FilterForm from "@/features/article/loadAllArticlesFilters/ui/articlesFiltersForm/filtersFields";
import OrderForm from "@/features/article/loadAllArticlesFilters/ui/articlesFiltersForm/sortFields";
import availableFiltersType from "@/features/article/loadAllArticlesFilters/model/type/availableFiltersType";
// next-intl
import { useTranslations } from "next-intl";
// shared
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { Form } from "@/shared/ui/form";

type Props = {
	className?: string;
	availableOptions: availableFiltersType;
	selectedValues: SelectedAllArticlesFiltersFormValuesType;
	handleFilterChange: (value: SearchAllArticlesFiltersFormSchemaType) => void;
};

const generateFormDefaultValue = (
	value: SelectedAllArticlesFiltersFormValuesType,
): SearchAllArticlesFiltersFormSchemaType => ({
	category: value?.category || [],
});

const Index = ({ className = "", availableOptions, selectedValues, handleFilterChange }: Props) => {
	const t = useTranslations();
	const form = useForm<SearchAllArticlesFiltersFormSchemaType>({
		defaultValues: generateFormDefaultValue(selectedValues),
		resolver: zodResolver(SearchAllArticlesFiltersFormSchema()),
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
			</form>
		</Form>
	);
};

export default Index;
