import { FormAutocompleteMultiselect, Option } from "@/shared/formUi/formAutocompleteMiltiselect";
import { Form } from "@/shared/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { AnimalSearchSchemaType } from "@/features/animal/searchAnimal/model/type";
import { AnimalSearchSchema } from "@/features/animal/searchAnimal/model/schema";
import { Button } from "@/shared/ui/button";
import FormCheckbox from "@/shared/formUi/formCheckbox";
import { useEffect, useMemo, useState } from "react";
import { SearchParamsType } from "@/types/searchParams.type";
import { ShelterType } from "@/entities/shelter/model/type";
import { queryGetAllAnimalsFilter } from "@/entities/animal/model/query/animalsAllByPageFilters";
import { species } from "@/constants/species";
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent, MarkerCoordinates } from "@/widget/googleMap/map";

type Props = {
	className?: string;
	searchParams: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	filterChage: (values: SearchParamsType) => void;
};

const Index = ({ className = "", searchParams, filterChage }: Props) => {
	const t = useTranslations();
	const { data: dataOptions } = queryGetAllAnimalsFilter({
		searchParams: searchParams,
	});
	// list of filter full available options
	const [animalFiltersOptionList, setAnimalFiltersOptionList] = useState<
		Partial<Record<keyof AnimalSearchSchemaType, Option[]>>
	>({
		species: [],
		breed: [],
		sex: [],
		size: [],
		age: [],
		state: [],
		shelterId: [],
	});
	// list of selected options
	const [animalFiltersDefaultOptions, setAnimalFiltersDefaultOptions] = useState<{
		species: string[];
		breed: string[];
		sex: string[];
		age: string[];
		size: string[];
		state: string[];
		shelterId: string[];
		sterilized: boolean;
		injury: boolean;
	}>({
		species: [],
		breed: [],
		sex: [],
		age: [],
		size: [],
		state: [],
		shelterId: [],
		sterilized: false,
		injury: false,
	});

	const [shelterMapMarkers, setShelterMarkers] = useState<MarkerCoordinates[]>([]);

	const animalSearchSchema = AnimalSearchSchema();
	const form = useForm<z.infer<typeof animalSearchSchema>>({
		defaultValues: {
			species: (animalFiltersDefaultOptions?.species as string[]) || [],
			breed: (animalFiltersDefaultOptions?.breed as string[]) || [],
			sex: (animalFiltersDefaultOptions?.sex as string[]) || [],
			age: (animalFiltersDefaultOptions?.age as string[]) || [],
			size: (animalFiltersDefaultOptions?.size as string[]) || [],
			state: (animalFiltersDefaultOptions?.shelterId as string[]) || [],
			shelterId: (animalFiltersDefaultOptions?.shelterId as string[]) || [],
			injury: (animalFiltersDefaultOptions?.injury as boolean) || false,
			sterilized: (animalFiltersDefaultOptions?.sterilized as boolean) || false,
		},
		resolver: zodResolver(animalSearchSchema),
	});

	// list of selected/available options memoizations
	useMemo(() => {
		if (!dataOptions) return;
		const defaultFilterOptions = {
			species: [],
			breed: [],
			sex: [],
			age: [],
			size: [],
			state: [],
			shelterId: [],
			sterilized: false,
			injury: false,
		} as {
			species: string[];
			breed: string[];
			sex: string[];
			age: string[];
			size: string[];
			state: string[];
			shelterId: string[];
			sterilized: boolean;
			injury: boolean;
		};
		const filterOptionsList = {
			species: [],
			breed: [],
			sex: [],
			size: [],
			age: [],
			state: [],
			shelterId: [],
		} as Partial<Record<keyof AnimalSearchSchemaType, Option[]>>;

		const { availableOptions, selectedOptions } = dataOptions as {
			availableOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[] | ShelterType[]>;
			selectedOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
		};
		// filling selected options
		Object.entries(selectedOptions).forEach(([key, value]) => {
			if (key === "injury") {
				defaultFilterOptions.injury = value[0] as boolean;
			} else if (key === "sterilized") {
				defaultFilterOptions["sterilized"] = value[0] as boolean;
			} else if (key === "species") {
				defaultFilterOptions.species = value as string[];
			} else if (key === "breed") {
				defaultFilterOptions.breed = value as string[];
			} else if (key === "sex") {
				defaultFilterOptions.sex = value as string[];
			} else if (key === "size") {
				defaultFilterOptions.size = value as string[];
			} else if (key === "age") {
				defaultFilterOptions.age = value as string[];
			} else if (key === "state") {
				defaultFilterOptions.state = value as string[];
			} else if (key === "shelterId") {
				defaultFilterOptions.shelterId = value as string[];
			}
		});
		// filling available options
		Object.entries(availableOptions).forEach(([key, value]) => {
			if (key === "species") {
				filterOptionsList.species = value.map((speciesValue) => ({
					values: [{ label: speciesValue, value: speciesValue }],
				})) as Option[];

				filterOptionsList.breed = value.map((speciesValue) => ({
					heading: { label: speciesValue, value: speciesValue },
					values: availableOptions.breed
						.filter((breed) =>
							species[speciesValue as keyof typeof species].breed.includes(breed as string),
						)
						.map((breed) => ({
							label: breed,
							value: breed,
						})),
				})) as Option[];
			} else if (key === "size") {
				filterOptionsList.size = value.map((sizeValue) => ({
					values: [{ label: sizeValue, value: sizeValue }],
				})) as Option[];
			} else if (key === "sex") {
				filterOptionsList.sex = value.map((sexValue) => ({
					values: [{ label: sexValue, value: sexValue }],
				})) as Option[];
			} else if (key === "age") {
				filterOptionsList.age = value.map((ageValue) => ({
					values: [{ label: ageValue, value: ageValue }],
				})) as Option[];
			} else if (key === "state") {
				filterOptionsList.state = value.map((stateValue) => ({
					values: [{ label: stateValue, value: stateValue }],
				})) as Option[];
			} else if (key === "shelterId") {
				filterOptionsList.shelterId = (value as ShelterType[]).map((shelter) => ({
					values: [{ label: shelter.name, value: String(shelter._id), coordinates: shelter.coordinates }],
				})) as Option[];

				if (selectedOptions.shelterId) {
					const selectedShelters = value
						.filter((el): el is ShelterType => typeof el !== "string" && typeof el !== "boolean")
						.filter(
							(el): el is ShelterType =>
								typeof el !== "string" &&
								typeof el !== "boolean" &&
								String(el._id) in selectedOptions.shelterId,
						);
					setShelterMarkers(selectedShelters.map((el) => el.coordinates));
				} else {
					setShelterMarkers(
						value
							.filter((el): el is ShelterType => typeof el !== "string" && typeof el !== "boolean")
							.map((el: ShelterType) => el.coordinates),
					);
				}
			}
		});

		setAnimalFiltersDefaultOptions(defaultFilterOptions);
		setAnimalFiltersOptionList(filterOptionsList);
	}, [dataOptions]);

	useEffect(() => {
		form.reset(animalFiltersDefaultOptions);
	}, [animalFiltersDefaultOptions]);

	const handleFilterChange = async (values: AnimalSearchSchemaType) => {
		const preparedAnimalSeachParams = Object.fromEntries(
			Object.entries(values)
				.filter(([_, value]) => value !== false)
				.map(([key, value]) =>
					key === "injury" || key === "sterilized" ? [key, String(value)] : [key, value],
				),
		);
		filterChage(preparedAnimalSeachParams);
	};

	const onSubmit = async (values: AnimalSearchSchemaType) => {
		handleFilterChange(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-8 ${className}`}>
				<FormAutocompleteMultiselect
					control={form.control}
					name="species"
					options={animalFiltersOptionList?.species || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-species")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="breed"
					options={animalFiltersOptionList?.breed || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-breed")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="age"
					options={animalFiltersOptionList?.age || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-age")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="sex"
					options={animalFiltersOptionList?.sex || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-sex")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="size"
					options={animalFiltersOptionList?.size || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-size")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="state"
					options={animalFiltersOptionList?.state || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-state")}
				/>

				<FormAutocompleteMultiselect
					control={form.control}
					name="shelterId"
					options={animalFiltersOptionList?.shelterId || []}
					emptyMessage={t("animal-search.no-results-found")}
					placeholder={t("animal-search.select-shelter")}
				/>

				<div className="flex h-60 flex-col px-10">
					<MapProvider>
						<MapComponent markerCoordinates={shelterMapMarkers} />
					</MapProvider>
				</div>

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
