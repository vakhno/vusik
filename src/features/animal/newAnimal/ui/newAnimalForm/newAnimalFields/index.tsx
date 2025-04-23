"use client";
// react
import { useEffect, useRef, useState } from "react";
// schemas
import NewAnimalSchema from "@/features/animal/newAnimal/model/schema/newAnimalSchema";
import NewAnimalSchemaType from "@/features/animal/newAnimal/model/type/newAnimalSchemaType";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormDragAndDropFileUploader from "@/shared/formUi/formDragAndDropFileUploader";
// UI components
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
// form UI components
import FormSingleSelect from "@/shared/formUi/formSingleSelect";
import FormInput from "@/shared/formUi/formInput";
import FormCalendar from "@/shared/formUi/formCalendar";
import FormCheckbox from "@/shared/formUi/formCheckbox";
import { useTranslations } from "next-intl";
import { Separator } from "@/shared/ui/separator";
import { species } from "@/shared/constants/species";
import AvailableNewAnimalOptionsType from "@/features/animal/newAnimal/model/type/availableFiltersType";

type Props = {
	availableOptions: AvailableNewAnimalOptionsType;
	handleSubmit?: (value: NewAnimalSchemaType) => void;
};

const NewAnimal = ({ availableOptions, handleSubmit }: Props) => {
	const t = useTranslations();
	const { shelters } = availableOptions;
	const newAnimalSchema = NewAnimalSchema();
	const [sexList, setSexList] = useState([]);
	const [sizeList, setSizeList] = useState([]);
	const [breedList, setBreedList] = useState([]);

	const speciesList = Object.entries(species)?.map(([key, _]) => ({
		id: key,
		value: key,
		label: key,
	})) as [];
	const shelterList = shelters?.map((shelter) => ({
		id: shelter._id,
		value: shelter._id,
		label: shelter.name,
	})) as [];

	const form = useForm<NewAnimalSchemaType>({
		defaultValues: {
			mainPhoto: undefined,
			secondaryPhotos: [],
			name: "",
			breed: "",
			shelterId: "",
			species: "",
			size: "",
			sex: "",
			sterilized: false,
			vaccinated: false,
			dewormed: false,
			passported: false,
			microchiped: false,
			injury: false,
			injuryDescription: "",
			birthday: undefined,
		},
		resolver: zodResolver(newAnimalSchema),
	});

	const injuryWatch = form.watch("injury");
	const speciesWatch = form.watch("species");

	const onNewAnimalSubmit = async (fields: NewAnimalSchemaType) => {
		handleSubmit && handleSubmit(fields);
	};

	useEffect(() => {
		if (!injuryWatch) {
			form.setValue("injuryDescription", "");
		}
	}, [injuryWatch]);

	const speciesChanged = useRef<boolean>(false);

	useEffect(() => {
		const speciesKey = form.getValues("species") as keyof typeof species;
		const selectedSpecies = species[speciesKey];

		if (selectedSpecies) {
			const newSexList = Object.keys(selectedSpecies.sex).map((sexItem) => ({
				value: sexItem,
				label: sexItem,
			})) as [];
			const newSizeList = Object.keys(selectedSpecies.size).map((sizeItem) => ({
				value: sizeItem,
				label: sizeItem,
			})) as [];
			const newBreedList = Object.keys(selectedSpecies.breed).map((breedItem) => ({
				value: breedItem,
				label: breedItem,
			})) as [];

			setSexList(newSexList);
			setSizeList(newSizeList);
			setBreedList(newBreedList);
		}
	}, [speciesWatch]);

	const mainPhotoChange = (file: File | File[] | undefined) => {
		if (Array.isArray(file)) {
			form.setValue("mainPhoto", file[0]);
		} else if (file) {
			form.setValue("mainPhoto", file);
		}
	};

	const secondaryPhotosChange = (files: File | File[] | undefined) => {
		if (Array.isArray(files)) {
			form.setValue("secondaryPhotos", files);
		} else if (files) {
			form.setValue("secondaryPhotos", [files]);
		}
	};

	const handleSpeciesChange = () => {
		speciesChanged.current = true;
		form.setValue("size", "");
		form.setValue("sex", "");
		form.setValue("breed", "");
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onNewAnimalSubmit)} className="h-full w-full space-y-8 px-2">
				<FormDragAndDropFileUploader control={form.control} label="Main photo" name="mainPhoto" onChange={mainPhotoChange} />

				<FormDragAndDropFileUploader control={form.control} label="Secondary photos" name="secondaryPhotos" onChange={secondaryPhotosChange} isMultiple />

				<FormInput control={form.control} label="Name" name="name" placeholder="Name" />

				<FormCalendar control={form.control} name="birthday" label="Birthday" placeholder="Birthday" />

				<FormSingleSelect control={form.control} name={"shelterId"} optionList={shelterList} placeholder={"Select shelter"} formLabel={"Shelter"} />

				<FormSingleSelect control={form.control} name={"species"} optionList={speciesList} placeholder={"Select an animal species"} formLabel={"Species"} handleChange={handleSpeciesChange} />

				{form.getValues("species") ? (
					<>
						<FormSingleSelect control={form.control} name={"breed"} optionList={breedList} placeholder={"Select an animal breed"} formLabel={"Breed"} />

						<FormSingleSelect control={form.control} name={"sex"} optionList={sexList} placeholder={"Select an animal sex"} formLabel={"Sex"} />

						<FormSingleSelect control={form.control} name={"size"} optionList={sizeList} placeholder={"Select an animal size"} formLabel={"Size"} />
					</>
				) : (
					<div className="flex w-full items-center">
						<Separator className="flex-1" />
						<span className="px-4 text-center">{t("page.animals.select-species-for-more-filters")}</span>
						<Separator className="flex-1" />
					</div>
				)}
				<FormCheckbox control={form.control} name="sterilized" label="Sterilization" description="Select if animal already sterilized" />

				<FormCheckbox control={form.control} name="vaccinated" label="Vaccinated" description="Select if animal already vaccinated" />

				<FormCheckbox control={form.control} name="dewormed" label="Dewormed" description="Select if animal already dewormed" />

				<FormCheckbox control={form.control} name="passported" label="Passported" description="Select if animal already has passport" />

				<FormCheckbox control={form.control} name="microchiped" label="Microchiped" description="Select if animal already microchiped" />

				<FormCheckbox control={form.control} name="injury" label="Injury" description="Select if animal have any injuries" />

				{form.getValues("injury") ? <FormInput control={form.control} label="Injury description" name="injuryDescription" placeholder="Injury description" /> : null}

				<div className="flex justify-between">
					<Button type="submit">Submit</Button>
				</div>
			</form>
		</Form>
	);
};

export default NewAnimal;
