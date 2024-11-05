import { AutocompleteMultiselect, Option } from "@/components/ui/autocompleteMultiselect";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { AnimalSearchSchema, AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";
import { Button } from "@/components/ui/button";
import FormCheckbox from "@/components/formUi/formCheckbox";
import { useEffect } from "react";

type Props = {
	handleFilterChange: (value: AnimalSearchSchemaType) => void;
	speciesList: Option[];
	defaultSpeciesListValue?: string[];
	breedList: Option[];
	defaultBreedListValue?: string[];
	sexList: Option[];
	defaultSexListValue?: string[];
	sizeList: Option[];
	defaultSizeListValue?: string[];
	ageList: Option[];
	defaultAgeListValue?: string[];
	shelterList: Option[];
	defaultShelterListValue?: string[];
	defaultInjuryValue: boolean;
	defaultSterilizedValue?: boolean;
};

const Index = ({
	handleFilterChange,
	speciesList,
	defaultSpeciesListValue = [],
	breedList,
	defaultBreedListValue = [],
	sexList,
	defaultSexListValue = [],
	sizeList,
	defaultSizeListValue = [],
	ageList,
	defaultAgeListValue = [],
	shelterList,
	defaultShelterListValue = [],
	defaultInjuryValue = false,
	defaultSterilizedValue = false,
}: Props) => {
	const t = useTranslations();
	const animalSearchSchema = AnimalSearchSchema();
	const form = useForm<z.infer<typeof animalSearchSchema>>({
		defaultValues: {
			species: defaultSpeciesListValue || [],
			breed: defaultBreedListValue || [],
			sex: defaultSexListValue || [],
			age: defaultSizeListValue || [],
			size: defaultAgeListValue || [],
			shelter: defaultShelterListValue || [],
			injury: defaultInjuryValue || false,
			sterilized: defaultSterilizedValue || false,
		},
		resolver: zodResolver(animalSearchSchema),
	});

	useEffect(() => {
		form.reset({
			species: defaultSpeciesListValue,
			breed: defaultBreedListValue,
			sex: defaultSexListValue,
			age: defaultAgeListValue,
			size: defaultSizeListValue,
			shelter: defaultShelterListValue,
			injury: defaultInjuryValue,
			sterilized: defaultSterilizedValue,
		});
	}, [
		defaultSpeciesListValue,
		defaultBreedListValue,
		defaultSexListValue,
		defaultAgeListValue,
		defaultSizeListValue,
		defaultShelterListValue,
		defaultInjuryValue,
		defaultSterilizedValue,
	]);

	const onSubmit = async (values: AnimalSearchSchemaType) => {
		handleFilterChange(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<AutocompleteMultiselect
					isForm
					control={form.control}
					name="species"
					options={speciesList}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-species")}
				/>

				<AutocompleteMultiselect
					isForm
					control={form.control}
					name="breed"
					options={breedList}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-breed")}
				/>
				<AutocompleteMultiselect
					isForm
					control={form.control}
					name="age"
					options={ageList}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-age")}
				/>

				<AutocompleteMultiselect
					isForm
					control={form.control}
					defaultValues={defaultSexListValue}
					name="sex"
					options={sexList}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-sex")}
				/>

				<AutocompleteMultiselect
					isForm
					control={form.control}
					name="size"
					options={sizeList}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-size")}
				/>

				<AutocompleteMultiselect
					isForm
					control={form.control}
					name="shelter"
					options={shelterList}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-shelter")}
				/>

				<FormCheckbox control={form.control} name="sterilized" label={t("animal-search.sterilized")} />

				<FormCheckbox control={form.control} name="injury" label={t("animal-search.injury")} />

				<Button type="submit" className="my-8 w-full justify-center">
					{t("search")}
				</Button>
			</form>
		</Form>
	);
};

export default Index;
