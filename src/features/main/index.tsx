"use client";
// react
import { useEffect, useState, useMemo } from "react";
// UI components
import { Button } from "@/components/ui/button";
import { Option } from "@/components/ui/autocompleteMultiselect";
// entities
import AnimalCard from "@/entities/animalCard";
// queries
import { queryGetAllAnimals, queryGetAllAnimalsInvalidate } from "@/queries/getAllAnimals.query";
import { queryGetAllAnimalsFilter, queryGetAllAnimalsFilterInvalidate } from "@/queries/getAllAnimalsFilter.query";
// features
import AnimalSearch from "@/features/profile/animalTab/animalSearch";
// types
import { AnimalType } from "@/types/animal.type";
// next-intl
import { useTranslations } from "next-intl";
// schemas
import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";
// utils
import { windowHistoryPush } from "@/utils/window";
// constants
import { species } from "@/constants/species";
import { animalsPerPage } from "@/constants/counts";
// skeleton componets
import AnimalCardSkeleton from "@/components/skeleton/animalCardSkeleton";

type Props = {
	searchParams: Record<string, string | string[]>;
};

const Index = ({ searchParams }: Props) => {
	// translation
	const t = useTranslations();
	// url search params
	const [animalSearchParams, setAnimalSearchParams] = useState<Record<string, string | string[]>>(searchParams);
	// list of displayed animals
	const [animals, setAnimals] = useState([]);
	// list of filter full available options
	const [animalFiltersOptionList, setAnimalFiltersOptionList] = useState<
		Partial<Record<keyof AnimalSearchSchemaType, Option[]>>
	>({
		species: [],
		breed: [],
		sex: [],
		size: [],
		age: [],
		shelter: [],
	});
	// list of selected options
	const [animalFiltersDefaultOptions, setAnimalFiltersDefaultOptions] = useState<
		Partial<Record<keyof AnimalSearchSchemaType, string[] | boolean>>
	>({
		injury: false,
		sterilized: false,
		species: [],
		breed: [],
		sex: [],
		size: [],
		age: [],
		shelter: [],
	});
	// query to get filter options
	const { data: dataOptions, refetch: dataOptionRefetch } = queryGetAllAnimalsFilter({
		searchParams: animalSearchParams,
	});
	// query to get animals
	const {
		fetchNextPage,
		data: dataAnimals,
		isLoading: isAnimalsLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
		refetch: dataAnimalsRefetch,
	} = queryGetAllAnimals({ searchParams: animalSearchParams });
	// list of animals memoizations
	useMemo(() => {
		const initialAnimals = dataAnimals?.pages.map((pages) => pages.animals).flat() ?? [];

		setAnimals(initialAnimals);
	}, [dataAnimals]);
	// list of selected/available options memoizations
	useMemo(() => {
		if (!dataOptions) return;
		const defaultFilterOptions = {
			injury: false,
			sterilized: false,
			species: [],
			breed: [],
			sex: [],
			size: [],
			age: [],
			shelter: [],
		} as Partial<Record<keyof AnimalSearchSchemaType, string[] | boolean>>;
		const filterOptionsList = {
			species: [],
			breed: [],
			sex: [],
			size: [],
			age: [],
			shelter: [],
		} as Partial<Record<keyof AnimalSearchSchemaType, Option[]>>;

		const { availableOptions, selectedOptions } = dataOptions as {
			availableOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
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
			} else if (key === "shelter") {
				defaultFilterOptions.shelter = value as string[];
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
						.filter((breed) => species[speciesValue].breed.includes(breed))
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
			} else if (key === "shelter") {
				filterOptionsList.shelter = value.map((shelter) => ({
					values: [{ label: shelter.name, value: shelter._id }],
				})) as Option[];
			}
		});

		setAnimalFiltersDefaultOptions(defaultFilterOptions);
		setAnimalFiltersOptionList(filterOptionsList);
	}, [dataOptions]);
	// use effects
	useEffect(() => {
		const urlSearchParams = new URLSearchParams();
		Object.entries(animalSearchParams).forEach(([key, value]) => {
			if (value) {
				if (Array.isArray(value)) {
					value.forEach((v) => urlSearchParams.append(key, String(v)));
				} else {
					urlSearchParams.set(key, String(value));
				}
			}
		});

		windowHistoryPush(urlSearchParams);
		queryGetAllAnimalsInvalidate({ searchParams: animalSearchParams });
		queryGetAllAnimalsFilterInvalidate({ searchParams: animalSearchParams });
		dataOptionRefetch();
		dataAnimalsRefetch();
	}, [animalSearchParams]);
	// handle functions
	const handleFilterChange = async (values: AnimalSearchSchemaType) => {
		const preparedAnimalSeachParams = Object.fromEntries(
			Object.entries(values)
				.filter(([_, value]) => value !== false)
				.map(([key, value]) =>
					key === "injury" || key === "sterilized" ? [key, String(value)] : [key, value],
				),
		);
		setAnimalSearchParams(preparedAnimalSeachParams);
	};

	return (
		<div>
			<AnimalSearch
				defaultSpeciesListValue={animalFiltersDefaultOptions?.species || []}
				defaultBreedListValue={animalFiltersDefaultOptions?.breed || []}
				defaultSexListValue={animalFiltersDefaultOptions?.sex || []}
				defaultAgeListValue={animalFiltersDefaultOptions?.age || []}
				defaultSizeListValue={animalFiltersDefaultOptions?.size || []}
				defaultShelterListValue={animalFiltersDefaultOptions?.shelter || []}
				defaultInjuryValue={animalFiltersDefaultOptions?.injury || false}
				defaultSterilizedValue={animalFiltersDefaultOptions?.sterilized || false}
				speciesList={animalFiltersOptionList?.species || []}
				breedList={animalFiltersOptionList?.breed || []}
				sexList={animalFiltersOptionList?.sex || []}
				sizeList={animalFiltersOptionList?.size || []}
				ageList={animalFiltersOptionList?.age || []}
				shelterList={animalFiltersOptionList?.shelter || []}
				handleFilterChange={handleFilterChange}
			/>
			{!isAnimalsLoading ? (
				<div className="flex justify-center">
					{animals && animals.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-420 gap-4">
								{animals.map((animal: AnimalType) => {
									return (
										<AnimalCard isEditable={false} key={animal._id.toString()} animal={animal} />
									);
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: animalsPerPage }, (_, index) => (
											<AnimalCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{hasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => fetchNextPage()}>{t("loadMore")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("noAnimals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-420 gap-4">
					{Array.from({ length: animalsPerPage }, (_, index) => (
						<AnimalCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
