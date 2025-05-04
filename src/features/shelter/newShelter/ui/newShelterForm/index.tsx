import React, { useState, useEffect } from "react";
import { NewShelterSchema } from "@/entities/shelter/model/schema/newShelterForm";
import { NewShelterSchemaType } from "@/entities/shelter/model/type/newShelterForm";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormDescription, FormLabel, FormItem, FormControl, FormField } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import FormTimePeriod from "@/shared/formUi/formTimePeriod";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import MapComponent, { MarkerInfo } from "@/shared/shared/GoogleMap";
import FormInput from "@/shared/formUi/formInput";
import { defaultMarkerCoordiates } from "@/shared/constants/googleMap";
import { defaultWorkingDays, defaultBeginTime, defaultEndTime, maxCountOfSpecificWeekends } from "@/shared/constants/workingDays";
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import { Card, CardContent } from "@/shared/ui/card";
import FormSpecificDay from "@/shared/formUi/formSpecificDay";
import { useTranslations } from "next-intl";
import FormDragAndDropFileUploader from "@/shared/formUi/formDragAndDropFileUploader";
import FormTextarea from "@/shared/formUi/formTextarea";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { Building2, Heart, User } from "lucide-react";

type Props = {
	isDeletable?: boolean;
	deleteButtonTitle?: string;
	handleSuccessDeleteClick?: (value: ShelterType) => void;
	shelter?: ShelterType;
	handleSuccessSubmitClick: (value: NewShelterSchemaType) => void;
};

const photoUrlToFile = async (url: string): Promise<File | null> => {
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

const AddNewShelterModal = ({ isDeletable = false, deleteButtonTitle, handleSuccessDeleteClick, handleSuccessSubmitClick, shelter }: Props) => {
	const t = useTranslations();
	const newShelterSchema = NewShelterSchema(t);
	const [defaultLogo, setDefaultLogo] = useState<File | null>(null);
	const [defaultMainImage, setDefaultMainImage] = useState<File | null>(null);
	const [defaultSecondaryImages, setDefaultSecondaryImages] = useState<File[] | null>([]);
	const newShelterForm = useForm<z.infer<typeof newShelterSchema>>({
		defaultValues: {
			type: shelter?.type || undefined,
			logo: defaultLogo || undefined,
			mainPhoto: defaultMainImage || undefined,
			secondaryPhotos: defaultSecondaryImages || [],
			name: shelter?.name || "",
			email: shelter?.email || "",
			story: shelter?.story || "",
			mission: shelter?.mission || "",
			losung: shelter?.losung || "",
			country: shelter?.country || "",
			state: shelter?.state || "",
			city: shelter?.city || "",
			street: shelter?.street || "",
			phone: shelter?.phone || "",
			postalCode: shelter?.postalCode || "",
			coordinates: shelter?.coordinates || defaultMarkerCoordiates,
			workingDays: shelter?.workingDays || defaultWorkingDays,
			specificWeekends: shelter?.specificWeekends || [],
		},
		resolver: zodResolver(newShelterSchema),
	});

	const { fields, append, remove } = useFieldArray({
		control: newShelterForm.control,
		name: "specificWeekends", // Field name for the array
	});

	const [currentAddress, setCurrentAddress] = useState<string>("");

	const shelterType = newShelterForm.watch("type");

	console.log(shelterType);

	const onNewAnimalSubmit = async (fields: z.infer<typeof newShelterSchema>) => {
		handleSuccessSubmitClick(fields);
	};

	const mainPhotoChange = (file: File[] | File | undefined) => {
		if (Array.isArray(file)) {
			newShelterForm.setValue("mainPhoto", file[0]);
		} else if (file) {
			newShelterForm.setValue("mainPhoto", file);
		}
	};

	const logoChange = (file: File[] | File | undefined) => {
		if (Array.isArray(file)) {
			newShelterForm.setValue("mainPhoto", file[0]);
		} else if (file) {
			newShelterForm.setValue("mainPhoto", file);
		}
	};

	const secondaryPhotosChange = (files: File[] | File | undefined) => {
		if (Array.isArray(files)) {
			newShelterForm.setValue("secondaryPhotos", files);
		} else if (files) {
			newShelterForm.setValue("secondaryPhotos", [files]);
		}
	};

	const handleMarkerDragEnd = (data: MarkerInfo) => {
		newShelterForm.setValue("country", data.address.country);
		newShelterForm.setValue("state", data.address.state);
		newShelterForm.setValue("city", data.address.city);
		newShelterForm.setValue("street", `${data.address.street}${data.address.streetNumber ? `, ${data.address.streetNumber}` : ""}`);
		newShelterForm.setValue("postalCode", data.postalCode);
		newShelterForm.setValue("coordinates", data.coordinates);

		const addressParts = [data.address.street && data.address.streetNumber ? `${data.address.street} ${data.address.streetNumber}` : data.address.street, data.address.city, data.address.state, data.address.country, data.postalCode].filter(Boolean);
		const fullAddress = addressParts.join(", ");
		setCurrentAddress(fullAddress);
	};

	useEffect(() => {
		(async () => {
			if (shelter?.logo) {
				const logoFile = (await photoUrlToFile(shelter?.logo)) as File | null;
				if (logoFile) {
					setDefaultLogo(logoFile);
					newShelterForm.setValue("logo", logoFile);
				}
			}
			if (shelter?.mainPhoto) {
				const mainPhotoFile = (await photoUrlToFile(shelter?.mainPhoto)) as File | null;
				if (mainPhotoFile) {
					setDefaultMainImage(mainPhotoFile);
					newShelterForm.setValue("mainPhoto", mainPhotoFile);
				}
			}
			if (shelter?.secondaryPhotos) {
				const secondaryPhotosFile = (await Promise.all(
					shelter?.secondaryPhotos.map(async (secondaryPhoto) => {
						const secondaryPhotoFile = await photoUrlToFile(secondaryPhoto);
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

	const addNewSpecificDay = () => {
		append({ month: "0", day: "0" });
	};

	return (
		<Form {...newShelterForm}>
			<form onSubmit={newShelterForm.handleSubmit(onNewAnimalSubmit)} className="h-full w-full space-y-8 px-2">
				{/* Shelter Type Selection - Always visible */}
				<FormField
					control={newShelterForm.control}
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-3">
							<FormLabel>Shelter Type</FormLabel>
							<FormDescription>Select the type of shelter organization</FormDescription>
							<FormControl>
								<ToggleGroup
									type="single"
									value={field.value}
									onValueChange={(value) => {
										if (value) field.onChange(value as "commercial" | "charity" | "individual");
									}}
									className="grid grid-cols-1 gap-4 sm:grid-cols-3"
								>
									<ToggleGroupItem value="commercial" className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
										<Building2 className="transition-colors" />
										<div className="text-center">
											<div className="font-semibold">Commercial</div>
											<div className="text-xs text-muted-foreground">For-profit organization</div>
											<p className="mt-2 text-xs text-muted-foreground">Professional animal care services with boarding facilities and veterinary support.</p>
										</div>
									</ToggleGroupItem>

									<ToggleGroupItem value="charity" className="flex h-full w-full flex-col items-center justify-center gap-2 border-card p-4">
										<Heart className="transition-colors" />
										<div className="text-center">
											<div className="font-semibold">Charity</div>
											<div className="text-xs text-muted-foreground">Non-profit organization</div>
											<p className="mt-2 text-xs text-muted-foreground">Volunteer-driven shelter focused on animal rescue and rehabilitation.</p>
										</div>
									</ToggleGroupItem>

									<ToggleGroupItem value="individual" className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
										<User className="transition-colors" />
										<div className="text-center">
											<div className="font-semibold">Individual</div>
											<div className="text-xs text-muted-foreground">Personal care provider</div>
											<p className="mt-2 text-xs text-muted-foreground">Independent caretaker offering personalized animal fostering services.</p>
										</div>
									</ToggleGroupItem>
								</ToggleGroup>
							</FormControl>
						</FormItem>
					)}
				/>

				{shelterType && (
					<div className="space-y-8">
						{shelterType === "commercial" || shelterType === "charity" ? <FormDragAndDropFileUploader control={newShelterForm.control} label="Logo" name="logo" onChange={logoChange} /> : <FormDragAndDropFileUploader control={newShelterForm.control} label="Avatar" name="avatar" onChange={logoChange} />}

						<FormDragAndDropFileUploader control={newShelterForm.control} label="Main photo" name="mainPhoto" onChange={mainPhotoChange} />

						<FormDragAndDropFileUploader control={newShelterForm.control} label="Secondary photos" name="secondaryPhotos" onChange={secondaryPhotosChange} isMultiple />

						<FormInput control={newShelterForm.control} label="Name" name="name" placeholder="Name" type="text" />
						<FormInput control={newShelterForm.control} label="Email" name="email" placeholder="Email" type="email" />
						<FormInput control={newShelterForm.control} label="Phone" name="phone" placeholder="Phone" type="tel" description="Mobile phone number" />

						{(shelterType === "commercial" || shelterType === "charity") && (
							<>
								<FormInput control={newShelterForm.control} label="Losung" name="losung" placeholder="Losung" type="text" />
								<FormTextarea className="max-h-[300px]" control={newShelterForm.control} label="Mission" name="mission" placeholder="Mission" type="text" />
							</>
						)}

						<FormTextarea className="max-h-[300px]" control={newShelterForm.control} label={shelterType === "individual" ? "About Me" : "Our Story"} name="story" placeholder={shelterType === "individual" ? "Tell us about yourself and your experience" : "Tell your organization's story"} type="text" />

						<div className="flex h-auto flex-col space-y-2">
							<FormLabel>{shelterType === "individual" ? "Your Location" : "Organization Location"}</FormLabel>
							<FormDescription>Click anywhere on the map to place a marker, or drag the existing marker to set your location</FormDescription>
							<div className="h-[400px] w-full">
								<GoogleMapProvider>
									<MapComponent className="h-full w-full" isMarkerDraggable={true} centerCoordinates={newShelterForm.getValues("coordinates")} markerPositionChange={handleMarkerDragEnd} />
								</GoogleMapProvider>
							</div>
							{currentAddress && <span className="text-sm font-bold text-muted-foreground">{currentAddress}</span>}
						</div>

						{(shelterType === "commercial" || shelterType === "charity") && (
							<>
								<Card>
									<CardContent className="p-4">
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.monday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.monday.end" isWeekendName="workingDays.monday.isWeekend" label="Monday" disabled={newShelterForm.getValues("workingDays.monday.isWeekend")} />
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.tuesday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.tuesday.end" isWeekendName="workingDays.tuesday.isWeekend" label="Tuesday" disabled={newShelterForm.getValues("workingDays.tuesday.isWeekend")} />
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.wednesday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.wednesday.end" isWeekendName="workingDays.wednesday.isWeekend" label="Wednesday" disabled={newShelterForm.getValues("workingDays.wednesday.isWeekend")} />
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.thursday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.thursday.end" isWeekendName="workingDays.thursday.isWeekend" label="Thursday" disabled={newShelterForm.getValues("workingDays.thursday.isWeekend")} />
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.friday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.friday.end" isWeekendName="workingDays.friday.isWeekend" label="Friday" disabled={newShelterForm.getValues("workingDays.friday.isWeekend")} />
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.saturday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.saturday.end" isWeekendName="workingDays.saturday.isWeekend" label="Saturday" disabled={newShelterForm.getValues("workingDays.saturday.isWeekend")} />
										<FormTimePeriod control={newShelterForm.control} checkboxLabel="is weekend" beginName="workingDays.sunday.begin" defaultBeginTime={defaultBeginTime} defaultEndTime={defaultEndTime} endName="workingDays.sunday.end" isWeekendName="workingDays.sunday.isWeekend" label="Sunday" disabled={newShelterForm.getValues("workingDays.sunday.isWeekend")} />
									</CardContent>
								</Card>

								<Card>
									<CardContent>
										{fields && fields.length ? (
											<>
												{fields.map((field, index) => (
													<FormSpecificDay key={field.id} control={newShelterForm.control} dayName={`specificWeekends.${index}.day`} monthName={`specificWeekends.${index}.month`} onHandleRemove={() => remove(index)} />
												))}
											</>
										) : null}
										{fields && fields.length < maxCountOfSpecificWeekends ? (
											<Button className="m-auto" type="button" onClick={addNewSpecificDay}>
												Add weekend
											</Button>
										) : null}
									</CardContent>
								</Card>
							</>
						)}

						<div className="flex justify-between">
							{isDeletable ? (
								<Button type="button" variant="destructive" onClick={() => shelter && handleSuccessDeleteClick && handleSuccessDeleteClick(shelter)}>
									{deleteButtonTitle}
								</Button>
							) : null}
							<Button type="submit">Submit</Button>
						</div>
					</div>
				)}
			</form>
		</Form>
	);
};

export default AddNewShelterModal;
