import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewShelterSchema, NewShelterSchemaType } from "@/schemas/shelter/shelter.schema";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import ImageUploading from "@/components/shared/ImageUploading";
import MultipleImageUploading from "@/components/shared/MultipleImageUploading/MultipleImageUploading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent, markerInfo } from "@/widget/googleMap/map";
import FormInput from "@/components/formUi/formInput";
import { defaultMarkerCoordiates } from "@/constants/googleMap";
import { Types } from "mongoose";
import { ShelterType } from "@/types/shelter.type";

type Props = {
	userId: Types.ObjectId;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	isDeletable?: boolean;
	deleteButtonTitle?: string;
	handleSuccessDeleteClick?: (value: ShelterType) => void;
	shelter: ShelterType;
	handleSuccessSubmitClick: (value: NewShelterSchemaType) => void;
	//
	mainPhotoValue?: string;
	secondaryPhotosValue?: string[];
	nameValue?: string;
	countryValue?: string;
	cityValue?: string;
	streetValue?: string;
	coordinatesValue?: { lat: number; lng: number };
	postalCodeValue?: string;
	phoneValue?: string;
};

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

const AddNewShelterModal = ({
	isOpen = false,
	setIsOpen,
	isDeletable = false,
	deleteButtonTitle,
	handleSuccessDeleteClick,
	handleSuccessSubmitClick,
	shelter,
	mainPhotoValue,
	secondaryPhotosValue,
	nameValue,
	countryValue,
	cityValue,
	streetValue,
	coordinatesValue,
	postalCodeValue,
	phoneValue,
}: Props) => {
	const newShelterSchema = NewShelterSchema();
	const [isLocationAutoFill, setIsLocationAutoFill] = useState(false);

	const [defaultMainImage, setDefaultMainImage] = useState<File | null>(null);
	const [defaultSecondaryImages, setDefaultSecondaryImages] = useState<File[] | null>([]);

	const newShelterForm = useForm<z.infer<typeof newShelterSchema>>({
		defaultValues: {
			mainPhoto: defaultMainImage || undefined,
			secondaryPhotos: defaultSecondaryImages || [],
			name: nameValue || "",
			country: countryValue || "",
			city: cityValue || "",
			street: streetValue || "",
			phone: phoneValue || "",
			postalCode: postalCodeValue || "",
			coordinates: coordinatesValue ||
				defaultMarkerCoordiates || {
					lat: 0,
					lng: 0,
				},
		},
		resolver: zodResolver(newShelterSchema),
	});

	const onNewAnimalSubmit = async (fields: z.infer<typeof newShelterSchema>) => {
		handleSuccessSubmitClick(fields);
	};

	const mainPhotoChange = (file: File) => {
		newShelterForm.setValue("mainPhoto", file);
	};

	const secondaryPhotosChange = (files: File[]) => {
		newShelterForm.setValue("secondaryPhotos", files);
	};

	const handleMarkerDragEnd = (data: markerInfo) => {
		if (isLocationAutoFill) {
			newShelterForm.setValue("country", data.adress.country);
			newShelterForm.setValue("city", data.adress.city);
			newShelterForm.setValue(
				"street",
				`${data.adress.street}${data.adress.streetNumber ? `, ${data.adress.streetNumber}` : ""}`,
			);
			newShelterForm.setValue("postalCode", data.postalCode);
			newShelterForm.setValue("coordinates", data.coordinates);
		}
	};

	useEffect(() => {
		(async () => {
			if (mainPhotoValue) {
				const mainPhotoFile = (await mainPhotoUrlToFile(mainPhotoValue)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					newShelterForm.setValue("mainPhoto", mainPhotoFile);
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
					newShelterForm.setValue("secondaryPhotos", secondaryPhotosFile);
				}
			}
		})();
	}, []);

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen} modal defaultOpen={isOpen}>
			<DialogContent className="h-full max-w-[720px]">
				<DialogHeader>
					<DialogTitle>Create new shelter</DialogTitle>
				</DialogHeader>
				<div className="flex h-full items-center space-x-2 overflow-auto">
					<Form {...newShelterForm}>
						<form
							onSubmit={newShelterForm.handleSubmit(onNewAnimalSubmit)}
							className="h-full w-full space-y-8 px-2"
						>
							<ImageUploading
								onChange={mainPhotoChange}
								className="m-auto h-96 max-h-full w-80 max-w-full"
							/>

							<MultipleImageUploading onChange={secondaryPhotosChange} imagesCount={4} />

							<FormInput control={newShelterForm.control} label="Name" name="name" placeholder="Name" />

							<FormInput
								control={newShelterForm.control}
								label="Phone"
								name="phone"
								placeholder="Phone"
								type="tel"
							/>

							<div className="flex h-60 flex-col">
								<Label className="mb-2">Location</Label>
								<div className="mb-2 grow">
									<MapProvider>
										<MapComponent
											isMarker
											isMarkerDraggable
											centerCoordinates={newShelterForm.getValues("coordinates")}
											markerCoordinates={newShelterForm.getValues("coordinates")}
											markerPositionChange={handleMarkerDragEnd}
										/>
									</MapProvider>
								</div>
								<div className="flex items-center space-x-2">
									<Checkbox
										id="locationAutoFilling"
										checked={isLocationAutoFill}
										onCheckedChange={() => setIsLocationAutoFill(!isLocationAutoFill)}
									/>
									<label
										htmlFor="locationAutoFilling"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Location auto filling
									</label>
								</div>
							</div>

							<FormInput
								control={newShelterForm.control}
								label="Country"
								name="country"
								placeholder="Country"
							/>

							<FormInput control={newShelterForm.control} label="City" name="city" placeholder="City" />

							<FormInput
								control={newShelterForm.control}
								label="Street"
								name="street"
								placeholder="Street"
							/>

							<FormInput
								control={newShelterForm.control}
								label="Postal code"
								name="postalCode"
								placeholder="Postal code"
							/>

							<div className="flex justify-between">
								<Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
									Close
								</Button>
								{isDeletable ? (
									<Button
										type="button"
										variant="destructive"
										onClick={() =>
											shelter && handleSuccessDeleteClick && handleSuccessDeleteClick(shelter)
										}
									>
										{deleteButtonTitle}
									</Button>
								) : null}
								<Button type="submit">Submit</Button>
							</div>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewShelterModal;
