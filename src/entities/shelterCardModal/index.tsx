import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewShelterSchema, NewShelterSchemaType } from "@/schemas/shelter/shelter.schema";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import ImageUploading from "@/components/shared/ImageUploading";
import MultipleImageUploading from "@/components/shared/MultipleImageUploading/MultipleImageUploading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormTimePeriod from "@/components/formUi/formTimePeriod";
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent, markerInfo } from "@/widget/googleMap/map";
import FormInput from "@/components/formUi/formInput";
import { defaultMarkerCoordiates } from "@/constants/googleMap";
import { defaultWorkingDays, defaultBeginTime, defaultEndTime } from "@/constants/workingDays";
import { Types } from "mongoose";
import { ShelterType } from "@/types/shelter.type";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import FormSingleSelect from "@/components/formUi/formSingleSelect";
import { monthLong, monthShort } from "@/constants/month";
import FormSpecificDay from "@/components/formUi/formSpecificDay";
type Props = {
	userId: Types.ObjectId;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	isDeletable?: boolean;
	deleteButtonTitle?: string;
	handleSuccessDeleteClick?: (value: ShelterType) => void;
	shelter?: ShelterType;
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
	workingDaysValue?: {
		monday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
		tuesday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
		wednesday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
		thursday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
		friday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
		saturday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
		sunday: {
			begin: string;
			end: string;
			isWeekend: boolean;
		};
	};
	specificWeekendValue: {
		month: number;
		day: number;
	}[];
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
	workingDaysValue,
	specificWeekendValue,
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
			workingDays: workingDaysValue || defaultWorkingDays,
			specificWeekends: specificWeekendValue || [],
		},
		resolver: zodResolver(newShelterSchema),
	});

	const { fields, append, remove } = useFieldArray({
		control: newShelterForm.control,
		name: "specificWeekends", // Field name for the array
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
							<Card>
								<CardContent className="p-4">
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

									<FormInput
										control={newShelterForm.control}
										label="City"
										name="city"
										placeholder="City"
									/>

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
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.monday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.monday.end"
										isWeekendName="workingDays.monday.isWeekend"
										label="Monday"
										disabled={newShelterForm.getValues("workingDays.monday.isWeekend")}
									/>

									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.tuesday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.tuesday.end"
										isWeekendName="workingDays.tuesday.isWeekend"
										label="Tuesday"
										disabled={newShelterForm.getValues("workingDays.tuesday.isWeekend")}
									/>

									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.wednesday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.wednesday.end"
										isWeekendName="workingDays.wednesday.isWeekend"
										label="Wednesday"
										disabled={newShelterForm.getValues("workingDays.wednesday.isWeekend")}
									/>

									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.thursday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.thursday.end"
										isWeekendName="workingDays.thursday.isWeekend"
										label="Thursday"
										disabled={newShelterForm.getValues("workingDays.thursday.isWeekend")}
									/>

									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.friday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.friday.end"
										isWeekendName="workingDays.friday.isWeekend"
										label="friday"
										disabled={newShelterForm.getValues("workingDays.friday.isWeekend")}
									/>

									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.saturday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.saturday.end"
										isWeekendName="workingDays.saturday.isWeekend"
										label="Saturday"
										disabled={newShelterForm.getValues("workingDays.saturday.isWeekend")}
									/>

									<FormTimePeriod
										control={newShelterForm.control}
										checkboxLabel="is weekend"
										beginName="workingDays.sunday.begin"
										defaultBeginTime={defaultBeginTime}
										defaultEndTime={defaultEndTime}
										endName="workingDays.sunday.end"
										isWeekendName="workingDays.sunday.isWeekend"
										label="Sunday"
										disabled={newShelterForm.getValues("workingDays.sunday.isWeekend")}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardContent>
									{fields && fields.length ? (
										<>
											{fields.map((field, index) => {
												<FormSpecificDay
													key={index}
													control={newShelterForm.control}
													dayName={`specificWeekends.${index}.day`}
													monthName={`specificWeekends.${index}.month`}
												/>;
											})}
										</>
									) : null}
								</CardContent>
							</Card>

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
