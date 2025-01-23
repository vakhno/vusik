"use client";
// react
import { useEffect, useRef, useState } from "react";
// schemas
import NewAnimalSchema from "@/entities/animal/model/schema/newAnimalForm";
import NewAnimalSchemaType from "@/entities/animal/model/type/newAnimalForm";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimalType } from "@/entities/animal/model/type";
import ImageUploading from "@/shared/shared/ImageUploading";
import MultipleImageUploading from "@/shared/shared/MultipleImageUploading/MultipleImageUploading";
// UI components
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
// form UI components
import FormSingleSelect from "@/shared/formUi/formSingleSelect";
import FormInput from "@/shared/formUi/formInput";
import FormCheckbox from "@/shared/formUi/formCheckbox";
import { ShelterType } from "@/entities/shelter/model/type";
import { SpeciesType } from "@/types/species.type";
import { useTranslations } from "next-intl";

type Props = {
	isDeletable?: boolean;
	modalTitle?: string;
	submitButtonTitle?: string;
	deleteButtonTitle?: string;
	animal?: AnimalType;
	shelters?: ShelterType[];
	species?: Record<string, SpeciesType>;
	handleSuccessSubmitClick?: (value: NewAnimalSchemaType) => void;
	handleSuccessDeleteClick?: (value: AnimalType) => void;
};

const NewAnimal = ({
	isDeletable,
	submitButtonTitle,
	deleteButtonTitle,
	animal,
	shelters,
	species = {},
	handleSuccessSubmitClick,
	handleSuccessDeleteClick,
}: Props) => {
	const t = useTranslations();
	const newAnimalSchema = NewAnimalSchema(t);
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

	const newPetForm = useForm<z.infer<typeof newAnimalSchema>>({
		defaultValues: {
			mainPhoto: defaultMainImage || undefined,
			secondaryPhotos: defaultSecondaryImages || [],
			name: animal?.name || "",
			breed: animal?.breed || "",
			shelterId: (animal?.shelterId || "") as string,
			species: animal?.species || "",
			size: animal?.size || "",
			sex: animal?.sex || "",
			sterilized: animal?.sterilized || false,
			injury: animal?.injury || false,
			injuryDescription: animal?.injuryDescription || "",
			age: animal?.age || "0",
		},
		resolver: zodResolver(newAnimalSchema),
	});

	const injuryWatch = newPetForm.watch("injury");
	const speciesWatch = newPetForm.watch("species");

	const onNewAnimalSubmit = async (fields: z.infer<typeof newAnimalSchema>) => {
		handleSuccessSubmitClick && handleSuccessSubmitClick(fields);
	};

	useEffect(() => {
		(async () => {
			if (animal?.mainPhoto) {
				const mainPhotoFile = (await mainPhotoUrlToFile(animal.mainPhoto)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					newPetForm.setValue("mainPhoto", mainPhotoFile);
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
					newPetForm.setValue("secondaryPhotos", secondaryPhotosFile);
				}
			}
		})();
	}, []);

	useEffect(() => {
		if (!injuryWatch) {
			newPetForm.setValue("injuryDescription", "");
		}
	}, [injuryWatch]);

	const speciesChanged = useRef<boolean>(false);

	useEffect(() => {
		const selectedSpecies = species[newPetForm.getValues("species")];

		// every species can have different size, sex and breed, so after every species changing we need to update sex, sixe and breed fields
		if (selectedSpecies) {
			const newSexList = selectedSpecies.sex.map((sexItem) => ({ value: sexItem, label: sexItem })) as [];
			const newSizeList = selectedSpecies.size.map((sizeItem) => ({ value: sizeItem, label: sizeItem })) as [];
			const newBreedList = selectedSpecies.breed.map((breedItem) => ({
				value: breedItem,
				label: breedItem,
			})) as [];

			setSexList(newSexList);
			setSizeList(newSizeList);
			setBreedList(newBreedList);
		}
	}, [speciesWatch]);

	const mainPhotoChange = (file: File | undefined) => {
		newPetForm.setValue("mainPhoto", file);
	};

	const secondaryPhotosChange = (files: File[]) => {
		newPetForm.setValue("secondaryPhotos", files);
	};

	const handleSpeciesChange = () => {
		// after every handle species change size, sex and breed fields will be cleared, because every species can have different size, sex and breed values
		speciesChanged.current = true;
		newPetForm.setValue("size", "");
		newPetForm.setValue("sex", "");
		newPetForm.setValue("breed", "");
	};

	return (
		<Form {...newPetForm}>
			<form onSubmit={newPetForm.handleSubmit(onNewAnimalSubmit)} className="h-full w-full space-y-8 px-2">
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

				<FormInput control={newPetForm.control} label="Name" name="name" placeholder="Name" />

				<FormInput
					control={newPetForm.control}
					name="age"
					label="Age"
					type="number"
					step="0.1"
					min={0}
					max={100}
					placeholder="Age"
					onChange={(event) => {
						let value = +event.target.value;
						const min = +event.target.min;
						const max = +event.target.max;
						if (value < min) {
							value = min;
						} else if (value > max) {
							value = max;
						}
						newPetForm.setValue("age", String(value));
					}}
				/>

				<FormSingleSelect
					control={newPetForm.control}
					name={"shelterId"}
					optionList={shelterList}
					placeholder={"Select shelter"}
					formLabel={"Shelter"}
				/>

				<FormSingleSelect
					control={newPetForm.control}
					name={"species"}
					optionList={speciesList}
					placeholder={"Select an animal species"}
					formLabel={"Species"}
					handleChange={handleSpeciesChange}
				/>

				<FormSingleSelect
					control={newPetForm.control}
					name={"breed"}
					optionList={breedList}
					placeholder={"Select an animal breed"}
					formLabel={"Breed"}
				/>

				<FormSingleSelect
					control={newPetForm.control}
					name={"sex"}
					optionList={sexList}
					placeholder={"Select an animal sex"}
					formLabel={"Sex"}
				/>

				<FormSingleSelect
					control={newPetForm.control}
					name={"size"}
					optionList={sizeList}
					placeholder={"Select an animal size"}
					formLabel={"Size"}
				/>

				<FormCheckbox
					control={newPetForm.control}
					name="sterilized"
					label="Sterilization"
					description="Select if animal already sterilized"
				/>

				<FormCheckbox
					control={newPetForm.control}
					name="injury"
					label="Injury"
					description="Select if animal have any injuries"
				/>

				{newPetForm.getValues("injury") ? (
					<FormInput
						control={newPetForm.control}
						label="Injury description"
						name="injuryDescription"
						placeholder="Injury description"
					/>
				) : null}

				<div className="flex justify-between">
					{isDeletable ? (
						<Button
							type="button"
							variant="destructive"
							onClick={() => animal && handleSuccessDeleteClick && handleSuccessDeleteClick(animal)}
						>
							{deleteButtonTitle}
						</Button>
					) : null}
					<Button type="submit">{submitButtonTitle}--</Button>
				</div>
			</form>
		</Form>
	);
};

export default NewAnimal;
