import { FormAutocompleteMultiselect, Option } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ShelterSearchSchemaType } from "@/entities/shelter/model/type/shelterSearch";
import { ShelterSearchSchema } from "@/entities/shelter/model/schema/shelterSearch";
import { Button } from "@/shared/ui/button";
import { useEffect, useMemo, useState } from "react";
import { SearchParamsType } from "@/types/searchParams.type";
import { queryGetAllSheltersFilter } from "@/entities/shelter/model/query/sheltersAllByPageFilters";
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent, MarkerCoordinates } from "@/widget/googleMap/map";

type Props = {
	className?: string;
	searchParams: SearchParamsType;
	filterChage: (values: SearchParamsType) => void;
};

const Index = ({ className = "", searchParams, filterChage }: Props) => {
	const t = useTranslations();
	const { data: dataOptions } = queryGetAllSheltersFilter({
		searchParams: searchParams,
	});
	// list of filter full available options
	const [shelterFiltersOptionList, setShelterFiltersOptionList] = useState<
		Partial<Record<keyof ShelterSearchSchemaType, Option[]>>
	>({
		city: [],
		state: [],
	});
	// list of selected options
	const [shelterFiltersDefaultOptions, setShelterFiltersDefaultOptions] = useState<
		Partial<Record<keyof ShelterSearchSchemaType, string[]>>
	>({
		city: [],
		state: [],
	});

	const [shelterMapMarkers, setShelterMapMarkers] = useState<MarkerCoordinates[]>([]);

	const shelterSearchSchema = ShelterSearchSchema();
	const form = useForm<z.infer<typeof shelterSearchSchema>>({
		defaultValues: {
			city: shelterFiltersDefaultOptions?.city || [],
			state: shelterFiltersDefaultOptions?.state || [],
		},
		resolver: zodResolver(shelterSearchSchema),
	});
	// list of selected/available options memoizations
	useMemo(() => {
		if (!dataOptions) return;
		const defaultFilterOptions = {
			city: [],
			state: [],
		} as Partial<Record<keyof ShelterSearchSchemaType, string[]>>;
		const filterOptionsList = {
			city: [],
			state: [],
		} as Partial<Record<keyof ShelterSearchSchemaType, Option[]>>;

		const { availableOptions, selectedOptions } = dataOptions as {
			availableOptions: Record<keyof ShelterSearchSchemaType, string[]>;
			selectedOptions: Record<keyof ShelterSearchSchemaType, string[]>;
		};
		// filling selected options
		Object.entries(selectedOptions).forEach(([key, value]) => {
			if (key === "city") {
				defaultFilterOptions.city = value as string[];
			} else if (key === "state") {
				defaultFilterOptions.state = value as string[];
			}
		});
		// filling available options
		Object.entries(availableOptions).forEach(([key, value]) => {
			if (key === "city") {
				filterOptionsList.city = value.map((cityValue) => ({
					values: [{ label: cityValue, value: cityValue }],
				})) as Option[];
			} else if (key === "state") {
				filterOptionsList.state = value.map((stateValue) => ({
					values: [{ label: stateValue, value: stateValue }],
				})) as Option[];
			}
		});

		// form.setValue("species", defaultFilterOptions?.species || []);
		setShelterFiltersDefaultOptions(defaultFilterOptions);
		setShelterFiltersOptionList(filterOptionsList);
	}, [dataOptions]);

	useEffect(() => {
		if (!dataOptions) return;
		const { availableOptions } = dataOptions as {
			availableOptions: Record<keyof ShelterSearchSchemaType, string[]> & { coordinates: MarkerCoordinates[] };
		};

		setShelterMapMarkers([...availableOptions.coordinates]);
	}, [dataOptions]);

	useEffect(() => {
		console.log("Updated markers for MapComponent:", shelterMapMarkers);
	}, [shelterMapMarkers]);

	useEffect(() => {
		form.reset(shelterFiltersDefaultOptions);
	}, [shelterFiltersDefaultOptions]);

	const handleFilterChange = async (values: ShelterSearchSchemaType) => {
		const preparedAnimalSeachParams = Object.fromEntries(
			Object.entries(values).map(([key, value]) =>
				key === "injury" || key === "sterilized" ? [key, String(value)] : [key, value],
			),
		);
		filterChage(preparedAnimalSeachParams);
	};

	const onSubmit = async (values: ShelterSearchSchemaType) => {
		handleFilterChange(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-8 ${className}`}>
				<FormAutocompleteMultiselect
					control={form.control}
					name="city"
					options={shelterFiltersOptionList?.city || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-species")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="state"
					options={shelterFiltersOptionList?.state || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-breed")}
				/>

				<div className="flex h-60 flex-col px-10">
					<MapProvider>
						<MapComponent markerCoordinates={shelterMapMarkers} />
					</MapProvider>
				</div>

				<Button type="submit" className="my-8 w-full justify-center">
					{t("search")}
				</Button>
			</form>
		</Form>
	);
};

export default Index;
