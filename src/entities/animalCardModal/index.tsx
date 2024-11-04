// react
import { useEffect, useRef, useState } from "react";
// schemas
import { NewAnimalSchema, NewAnimalSchemaType } from "@/schemas/animal/animal.schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimalType } from "@/types/animal.type";
import ImageUploading from "@/components/shared/ImageUploading";
import MultipleImageUploading from "@/components/shared/MultipleImageUploading/MultipleImageUploading";
// UI components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
// form UI components
import FormSingleSelect from "@/components/formUi/formSingleSelect";
import FormInput from "@/components/formUi/formInput";
import FormCheckbox from "@/components/formUi/formCheckbox";
import { ShelterType } from "@/types/shelter.type";
import { SpeciesType } from "@/types/species.type";
import { useTranslations } from "next-intl";

type Props =
	| {
			isDeletable?: false;
			isOpen: boolean;
			modalTitle: string;
			submitButtonTitle: string;
			closeButtonTitle: string;
			deleteButtonTitle?: false;
			setIsOpen?: (value: boolean) => void;
			shelters: ShelterType[];
			animal?: AnimalType;
			species: Record<string, SpeciesType>;
			handleSuccessSubmitClick: (value: NewAnimalSchemaType) => void;
			handleCloseClick: () => void;
			handleSuccessDeleteClick?: false;

			mainPhotoValue?: string;
			secondaryPhotosValue?: string[];
			nameValue?: string;
			ageValue?: string;
			shelterValue?: string;
			sexValue?: string;
			speciesValue?: string;
			breedValue?: string;
			sizeValue?: string;
			sterilizedValue?: boolean;
			injuryValue?: boolean;
			injuryDescriptionValue?: string;
	  }
	| {
			isDeletable: true;
			isOpen: boolean;
			modalTitle: string;
			submitButtonTitle: string;
			closeButtonTitle: string;
			deleteButtonTitle?: string;
			setIsOpen?: (value: boolean) => void;
			animal: AnimalType;
			shelters?: ShelterType[];
			species: Record<string, SpeciesType>;
			handleSuccessSubmitClick: (value: NewAnimalSchemaType) => void;
			handleCloseClick: () => void;
			handleSuccessDeleteClick?: (value: AnimalType) => void;

			mainPhotoValue?: string;
			secondaryPhotosValue?: string[];
			nameValue?: string;
			ageValue?: string;
			shelterValue?: string;
			sexValue?: string;
			speciesValue?: string;
			breedValue?: string;
			sizeValue?: string;
			sterilizedValue?: boolean;
			injuryValue?: boolean;
			injuryDescriptionValue?: string;
	  };

const AddNewAnimalModal = ({
	isDeletable,
	isOpen = false,
	modalTitle,
	submitButtonTitle,
	closeButtonTitle,
	deleteButtonTitle,
	setIsOpen,
	animal,
	shelters,
	species,
	handleSuccessSubmitClick,
	handleCloseClick,
	handleSuccessDeleteClick,

	mainPhotoValue,
	secondaryPhotosValue,
	nameValue,
	ageValue,
	shelterValue,
	sexValue,
	speciesValue,
	breedValue,
	sizeValue,
	sterilizedValue,
	injuryValue,
	injuryDescriptionValue,
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
			name: nameValue || "",
			breed: breedValue || "",
			shelterId: shelterValue || "",
			species: speciesValue || "",
			size: sizeValue || "",
			sex: sexValue || "",
			sterilized: sterilizedValue || false,
			injury: injuryValue || false,
			injuryDescription: injuryDescriptionValue || "",
			age: ageValue || "0",
		},
		resolver: zodResolver(newAnimalSchema),
	});

	const injuryWatch = newPetForm.watch("injury");
	const speciesWatch = newPetForm.watch("species");

	const onNewAnimalSubmit = async (fields: z.infer<typeof newAnimalSchema>) => {
		handleSuccessSubmitClick(fields);
	};

	useEffect(() => {
		(async () => {
			if (mainPhotoValue) {
				const mainPhotoFile = (await mainPhotoUrlToFile(mainPhotoValue)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					newPetForm.setValue("mainPhoto", mainPhotoFile);
				}
			}
			if (secondaryPhotosValue) {
				const secondaryPhotosFile = (await Promise.all(
					secondaryPhotosValue.map(async (secondaryPhoto) => {
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
		<Dialog onOpenChange={setIsOpen} open={isOpen} modal defaultOpen={isOpen}>
			<DialogContent className="h-full max-w-[720px]">
				<DialogHeader>
					<DialogTitle>{modalTitle}</DialogTitle>
				</DialogHeader>
				<div className="flex h-full items-center space-x-2 overflow-auto">
					<Form {...newPetForm}>
						<form
							onSubmit={newPetForm.handleSubmit(onNewAnimalSubmit)}
							className="h-full w-full space-y-8 px-2"
						>
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
								<Button type="button" variant="secondary" onClick={handleCloseClick}>
									{closeButtonTitle}
								</Button>
								{isDeletable ? (
									<Button
										type="button"
										variant="destructive"
										onClick={() =>
											animal && handleSuccessDeleteClick && handleSuccessDeleteClick(animal)
										}
									>
										{deleteButtonTitle}
									</Button>
								) : null}
								<Button type="submit">{submitButtonTitle}</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewAnimalModal;
