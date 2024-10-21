import { useEffect, useState, useMemo } from "react";
// next tools
// UI components
import { Button } from "@/components/ui/button";
// zod
import { AnimalType } from "@/types/animal.type";
import { ShelterType } from "@/types/shelter.type";
import AddNewAnimal from "@/features/profile/animalTab/addNewAnimal";
import AnimalSearch from "@/features/profile/animalTab/animalSearch";
import { AnimalSearchSchemaType } from "@/schemas/animal/animalSearch.schema";
import { Option } from "@/components/ui/autocompleteMultiselect";
import { Types } from "mongoose";
import { queryGetProfileAnimals, queryGetProfileAnimalsInvalidate } from "@/queries/getProfileAnimals";
import {
	queryGetProfileAnimalsFilter,
	queryGetProfileAnimalsFilterInvalidate,
} from "@/queries/getProfileAnimalsFilter";
import { windowHistoryPush } from "@/utils/window";
import { species } from "@/constants/species";
import AnimalCard from "@/entities/animalCard";
import { animalsPerPage } from "@/constants/counts";

import AnimalCardSkeleton from "@/components/skeleton/animalCardSkeleton";
import { useTranslations } from "next-intl";

type Props = {
	isEditable?: boolean;
	shelters: ShelterType[];
	userId: Types.ObjectId;
	searchParams?: Record<string, string | string[]>;
};

// const defaultFilterValues: AnimalSearchSchemaType = {
// 	species: [],
// 	breed: [],
// 	sex: [],
// 	age: [],
// 	size: [],
// 	shelter: [],
// 	sterilized: false,
// 	injury: false,
// };

const Index = ({ isEditable = false, shelters, userId, searchParams = {} }: Props) => {
	const [isCreateNewPetActive, setIsCreateNewPetActive] = useState<boolean>(false);
	const [animalFilters, setAnimalFilters] = useState<Record<string, string | string[]>>(searchParams);
	const t = useTranslations();
	// queries
	const { data: dataOptions, refetch: dataOptionRefetch } = queryGetProfileAnimalsFilter({
		searchParams: animalFilters,
		id: userId,
	});

	const {
		fetchNextPage,
		isPending,
		isFetchingNextPage,
		hasNextPage,
		data: dataAnimals,
		isLoading: isAnimalsLoading,
		refetch: dataAnimalsRefetch,
	} = queryGetProfileAnimals({ searchParams: animalFilters, id: userId });

	const [animals, setAnimals] = useState([]);

	useMemo(() => {
		const initialAnimals = dataAnimals?.pages.map((pages) => pages.animals).flat() ?? [];

		setAnimals(initialAnimals);
	}, [dataAnimals]);

	const {
		defaultSpeciesList,
		defaultBreedList,
		defaultSexList,
		defaultSizeList,
		defaultAgeList,
		defaultShelterList,
		defaultInjury,
		defaultSterilized,
		speciesList,
		breedList,
		sexList,
		sizeList,
		ageList,
		shelterList,
	} = useMemo(() => {
		const initialState = {
			defaultSpeciesList: [] as string[],
			defaultBreedList: [] as string[],
			defaultSexList: [] as string[],
			defaultSizeList: [] as string[],
			defaultAgeList: [] as string[],
			defaultShelterList: [] as string[],
			defaultInjury: false,
			defaultSterilized: false,
			speciesList: [] as Option[],
			breedList: [] as Option[],
			sexList: [] as Option[],
			sizeList: [] as Option[],
			ageList: [] as Option[],
			shelterList: [] as Option[],
		};

		if (!dataOptions) return initialState;

		const { availableOptions, selectedOptions } = dataOptions as {
			availableOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
			selectedOptions: Record<keyof AnimalSearchSchemaType, string[] | boolean[]>;
		};
		// Fill default values
		Object.entries(selectedOptions).forEach(([key, value]) => {
			if (key === "injury") {
				initialState.defaultInjury = value[0] as boolean;
			} else if (key === "sterilized") {
				initialState.defaultSterilized = value[0] as boolean;
			} else if (key === "species") {
				initialState.defaultSpeciesList = value as string[];
			} else if (key === "breed") {
				initialState.defaultBreedList = value as string[];
			} else if (key === "sex") {
				initialState.defaultSexList = value as string[];
			} else if (key === "size") {
				initialState.defaultSizeList = value as string[];
			} else if (key === "age") {
				initialState.defaultAgeList = value as string[];
			} else if (key === "shelter") {
				initialState.defaultShelterList = value as string[];
			}
		});

		// Create formatted option lists
		Object.entries(availableOptions).forEach(([key, value]) => {
			if (key === "species") {
				initialState.speciesList = value.map((speciesValue) => ({
					values: [{ label: speciesValue, value: speciesValue }],
				}));

				initialState.breedList = value.map((speciesValue) => ({
					heading: { label: speciesValue, value: speciesValue },
					values: availableOptions.breed
						.filter((breed) => species[speciesValue].breed.includes(breed))
						.map((breed) => ({
							label: breed,
							value: breed,
						})),
				}));
			} else if (key === "size") {
				initialState.sizeList = value.map((sizeValue) => ({
					values: [{ label: sizeValue, value: sizeValue }],
				}));
			} else if (key === "sex") {
				initialState.sexList = value.map((sexValue) => ({
					values: [{ label: sexValue, value: sexValue }],
				}));
			} else if (key === "age") {
				initialState.ageList = value.map((ageValue) => ({
					values: [{ label: ageValue, value: ageValue }],
				}));
			} else if (key === "shelter") {
				initialState.shelterList = value.map((shelter) => ({
					values: [{ label: shelter.name, value: shelter._id }],
				}));
			}
		});
		return initialState;
	}, [dataOptions, dataAnimals, animalFilters]);

	useEffect(() => {
		const urlSearchParams = new URLSearchParams();
		Object.entries(animalFilters).forEach(([key, value]) => {
			if (value) {
				if (Array.isArray(value)) {
					value.forEach((v) => urlSearchParams.append(key, String(v)));
				} else {
					urlSearchParams.set(key, String(value));
				}
			}
		});
		windowHistoryPush(urlSearchParams);

		queryGetProfileAnimalsInvalidate({ searchParams: animalFilters, id: userId });
		queryGetProfileAnimalsFilterInvalidate({ searchParams: animalFilters, id: userId });
		dataOptionRefetch();
		dataAnimalsRefetch();
	}, [dataOptions, animalFilters]);

	const handleFilterChange = async (values: AnimalSearchSchemaType) => {
		const preparedAnimalSeachParams = Object.fromEntries(
			Object.entries(values)
				.filter(([_, value]) => value !== false)
				.map(([key, value]) =>
					key === "injury" || key === "sterilized" ? [key, String(value)] : [key, value],
				),
		);
		setAnimalFilters(preparedAnimalSeachParams);
	};

	const addNewPet = () => {
		setIsCreateNewPetActive(true);
	};

	return (
		<div>
			<AddNewAnimal
				shelters={shelters}
				isOpen={isCreateNewPetActive}
				setIsOpen={setIsCreateNewPetActive}
				userId={userId}
			/>
			<div>
				{isEditable ? (
					<Button onClick={addNewPet} className="my-8 w-full">
						Add new animal
					</Button>
				) : null}
				<AnimalSearch
					defaultSpeciesListValue={defaultSpeciesList}
					defaultBreedListValue={defaultBreedList}
					defaultSexListValue={defaultSexList}
					defaultAgeListValue={defaultAgeList}
					defaultSizeListValue={defaultSizeList}
					defaultShelterListValue={defaultShelterList}
					defaultInjuryValue={defaultInjury}
					defaultSterilizedValue={defaultSterilized}
					speciesList={speciesList}
					breedList={breedList}
					sexList={sexList}
					sizeList={sizeList}
					ageList={ageList}
					shelterList={shelterList}
					handleFilterChange={handleFilterChange}
				/>
			</div>
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
								<div>
									<Button onClick={() => fetchNextPage()}>{t("loadMore")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>no animals yet</span>
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
