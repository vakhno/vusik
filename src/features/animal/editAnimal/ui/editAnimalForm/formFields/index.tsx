"use client";
// react
import { useEffect, useRef, useState } from "react";
// react-hook-form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploading from "@/shared/shared/ImageUploading";
import MultipleImageUploading from "@/shared/shared/MultipleImageUploading/MultipleImageUploading";
// UI components
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
// form UI components
import FormSingleSelect from "@/shared/formUi/formSingleSelect";
import FormInput from "@/shared/formUi/formInput";
import FormCheckbox from "@/shared/formUi/formCheckbox";
import { useTranslations } from "next-intl";
import { Separator } from "@/shared/ui/separator";
import AvailableEditAnimalOptionsType from "@/features/animal/editAnimal/model/type/availableFiltersType";
import SelectedEditAnimalOptionsType from "@/features/animal/editAnimal/model/type/selectedFiltersType";
import EditAnimalSchemaType from "@/features/animal/editAnimal/model/type/editAnimalSchemaType";
import EditAnimalSchema from "@/features/animal/editAnimal/model/schema/editAnimalSchema";
import { species } from "@/shared/constants/species";

type Props = {
	availableOptions: AvailableEditAnimalOptionsType;
	selectedOptions: SelectedEditAnimalOptionsType | null;
	handleSubmit?: (value: EditAnimalSchemaType) => void;
};

const calculateAnimalAge = (birthDay: string) => {
	const dob = new Date(birthDay);
	const currentDate = new Date();

	// Ensure birth date is not in the future
	if (dob > currentDate) {
		return { years: 0, months: 0 }; // Prevent negative age
	}

	// Calculate difference in years, months, and days
	let years = currentDate.getFullYear() - dob.getFullYear();
	let months = currentDate.getMonth() - dob.getMonth();
	let days = currentDate.getDate() - dob.getDate();

	// Adjust if the current month is before the birth month
	if (months < 0) {
		years--;
		months += 12;
	}

	// If days are negative, adjust months
	if (days < 0) {
		months--;

		// Get the number of days in the previous month
		const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
		days += previousMonth.getDate();
	}

	// If the birth date is today, set months to 1
	if (dob.toDateString() === currentDate.toDateString()) {
		months = 1;
	}

	// If the age is less than a month but more than 0 days, set months to 1
	if (years === 0 && months === 0 && days > 0) {
		months = 1;
	}

	return { years, months };
};

const NewAnimal = ({ availableOptions, selectedOptions, handleSubmit }: Props) => {
	const t = useTranslations();
	const newAnimalSchema = EditAnimalSchema();
	const { shelters } = availableOptions;
	const animal = selectedOptions;
	const [sexList, setSexList] = useState([]);
	const [sizeList, setSizeList] = useState([]);
	const [breedList, setBreedList] = useState([]);
	const [defaultMainImage, setDefaultMainImage] = useState<File>();
	const [defaultSecondaryImages, setDefaultSecondaryImages] = useState<File[]>([]);

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

	const mainPhotoUrlToFile = async (url: string): Promise<File | null> => {
		try {
			const response = await fetch(url);
			const { ok } = response;

			if (ok) {
				const contentType = response.headers.get("Content-Type");

				if (contentType === "image/jpeg" || contentType === "image/png" || contentType === "image/webp") {
					const extension = contentType.split("/").pop();
					const fileName = (url.split("/").pop() || "image") + `.${extension}`;
					const blob = await response.blob();
					const file = new File([blob], fileName, { type: contentType });

					return file;
				} else {
					return null;
				}
			} else {
				return null;
			}
		} catch (_) {
			return null;
		}
	};

	const form = useForm<EditAnimalSchemaType>({
		defaultValues: {
			mainPhoto: defaultMainImage || undefined,
			secondaryPhotos: defaultSecondaryImages || [],
			name: animal?.name || "",
			breed: animal?.breed || "",
			shelterId: (animal?.shelterId.toString() || "") as string,
			species: animal?.species || "",
			size: animal?.size || "",
			sex: animal?.sex || "",
			sterilized: animal?.sterilized || false,
			injury: animal?.injury || false,
			injuryDescription: animal?.injuryDescription || "",
			age: animal?.age || "",
		},
		resolver: zodResolver(newAnimalSchema),
	});

	const injuryWatch = form.watch("injury");
	const speciesWatch = form.watch("species");

	const onNewAnimalSubmit = async (fields: EditAnimalSchemaType) => {
		handleSubmit && handleSubmit(fields);
	};

	useEffect(() => {
		(async () => {
			if (animal?.mainPhoto) {
				const mainPhotoFile = (await mainPhotoUrlToFile(animal.mainPhoto)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					form.setValue("mainPhoto", mainPhotoFile);
				}
			}

			if (animal?.secondaryPhotos) {
				const secondaryPhotosFile = (await Promise.all(
					animal.secondaryPhotos.map(async (secondaryPhoto) => {
						const secondaryPhotoFile = await mainPhotoUrlToFile(secondaryPhoto);
						return secondaryPhotoFile;
					}),
				)) as File[] | null;
				if (secondaryPhotosFile) {
					setDefaultSecondaryImages(secondaryPhotosFile);
					form.setValue("secondaryPhotos", secondaryPhotosFile);
				}
			}
		})();
	}, []);

	useEffect(() => {
		if (!injuryWatch) {
			form.setValue("injuryDescription", "");
		}
	}, [injuryWatch]);

	const speciesChanged = useRef<boolean>(false);

	useEffect(() => {
		const speciesKey = form.getValues("species") as keyof typeof species;
		const selectedSpecies = species[speciesKey];

		// every species can have different size, sex and breed, so after every species changing we need to update sex, sixe and breed fields
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

	const mainPhotoChange = (file: File | undefined) => {
		form.setValue("mainPhoto", file);
	};

	const secondaryPhotosChange = (files: File[]) => {
		form.setValue("secondaryPhotos", files);
	};

	const handleSpeciesChange = () => {
		// after every handle species change size, sex and breed fields will be cleared, because every species can have different size, sex and breed values
		speciesChanged.current = true;
		form.setValue("size", "");
		form.setValue("sex", "");
		form.setValue("breed", "");
	};

	const birthDate = form.watch("age");

	// Function to calculate age dynamically
	const calculateAgeDescription = (date: string) => {
		if (!date) {
			return "";
		} else {
			const { years, months } = calculateAnimalAge(date);
			return `Years: ${years} Months: ${months}`;
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onNewAnimalSubmit)} className="h-full w-full space-y-8 px-2">
				<ImageUploading
					// defaultPreviewImage={mainPhotoValue}
					defaultFile={defaultMainImage}
					onChange={mainPhotoChange}
					className="m-auto h-96 max-h-full w-80 max-w-full"
				/>

				<MultipleImageUploading
					defaultFiles={defaultSecondaryImages}
					onChange={secondaryPhotosChange}
					imagesCount={4}
				/>

				<FormInput control={form.control} label="Name" name="name" placeholder="Name" />

				<FormInput
					control={form.control}
					name="age"
					label="Birth"
					type="date"
					max={new Date().toISOString().split("T")[0]}
					description={calculateAgeDescription(birthDate)}
					placeholder="Birth"
				/>

				<FormSingleSelect
					control={form.control}
					name={"shelterId"}
					optionList={shelterList}
					placeholder={"Select shelter"}
					formLabel={"Shelter"}
				/>

				<FormSingleSelect
					control={form.control}
					name={"species"}
					optionList={speciesList}
					placeholder={"Select an animal species"}
					formLabel={"Species"}
					handleChange={handleSpeciesChange}
				/>

				{form.getValues("species") ? (
					<>
						<FormSingleSelect
							control={form.control}
							name={"breed"}
							optionList={breedList}
							placeholder={"Select an animal breed"}
							formLabel={"Breed"}
						/>

						<FormSingleSelect
							control={form.control}
							name={"sex"}
							optionList={sexList}
							placeholder={"Select an animal sex"}
							formLabel={"Sex"}
						/>

						<FormSingleSelect
							control={form.control}
							name={"size"}
							optionList={sizeList}
							placeholder={"Select an animal size"}
							formLabel={"Size"}
						/>
					</>
				) : (
					<div className="flex w-full items-center">
						<Separator className="flex-1" />
						<span className="px-4 text-center">{t("page.animals.select-species-for-more-filters")}</span>
						<Separator className="flex-1" />
					</div>
				)}
				<FormCheckbox
					control={form.control}
					name="sterilized"
					label="Sterilization"
					description="Select if animal already sterilized"
				/>

				<FormCheckbox
					control={form.control}
					name="injury"
					label="Injury"
					description="Select if animal have any injuries"
				/>

				{form.getValues("injury") ? (
					<FormInput
						control={form.control}
						label="Injury description"
						name="injuryDescription"
						placeholder="Injury description"
					/>
				) : null}

				<div className="flex justify-between">
					<Button type="submit">Submit</Button>
				</div>
			</form>
		</Form>
	);
};

export default NewAnimal;
