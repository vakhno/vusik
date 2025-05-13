"use client";

import { query_getShelterById } from "@/entities/shelter/model/query/shelterById";
import generateShelterMarkers from "@/entities/shelter/model/utils/generateGoogleMapShelterMarkers";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/shared/ui/carousel";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Badge } from "@/shared/ui/badge";
import { DEFAULT_SHELTER_MAIN_IMAGE, DEFAULT_SHELTER_SECONDARY_IMAGE } from "@/shared/constants/public";
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Pin, Phone, Users, Heart, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = { shelterId: string };

const ShelterProfile = ({ shelterId }: Props) => {
	const t = useTranslations();

	const { data: shelterData } = query_getShelterById({ shelterId });

	if (shelterData) {
		const shelter = shelterData;
		const mainPhoto = shelter.mainPhoto || DEFAULT_SHELTER_MAIN_IMAGE;
		const secondaryPhotos = shelter.secondaryPhotos && shelter.secondaryPhotos.length ? shelter.secondaryPhotos : Array(3).fill(DEFAULT_SHELTER_SECONDARY_IMAGE);
		const photos = [mainPhoto, ...secondaryPhotos];
		const shelterMarker: MarkerType[] = generateShelterMarkers([shelter]);

		const workingHours = Object.entries(shelter.workingDays)
			.filter(([_, { isWeekend }]) => !isWeekend)
			.map(([day, { begin, end }]) => ({
				day: day.charAt(0).toUpperCase() + day.slice(1),
				hours: `${begin} - ${end}`,
			}));

		return (
			<div className="grid gap-4 md:grid-cols-2 md:grid-rows-[auto_1fr_auto]">
				<Card>
					<CardHeader className="pt-0" />
					<CardContent>
						<Carousel opts={{ loop: true }}>
							<CarouselContent>
								{photos.map((photo, index) => (
									<CarouselItem key={index}>
										<AspectRatio ratio={4 / 3}>
											<Image src={photo} alt={`${shelter.name} photo`} fill className="rounded-md object-cover" />
										</AspectRatio>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
							<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
						</Carousel>
					</CardContent>
				</Card>

				<Card className="flex h-full flex-col md:row-span-2">
					<CardHeader className="pt-0" />
					<CardContent className="flex h-full flex-col justify-between">
						<div className="flex flex-col">
							<div className="mb-4 flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-extrabold">{shelter.name}</h2>
									<Badge>Active</Badge>
								</div>
							</div>
							<p className="text-muted-foreground">{shelter.losung}</p>
							<dl className="mt-4 gap-x-4 gap-y-2">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Pin className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Address</dt>
											<dd className="text-lg font-semibold">
												{shelter.street}, {shelter.city}, {shelter.state}, {shelter.postalCode}
											</dd>
										</div>
									</div>
									<div className="mb-inson2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Phone className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Phone</dt>
											<dd className="text-lg font-semibold">{shelter.phone}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Users className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Active Members</dt>
											<dd className="text-lg font-semibold">{shelter.activeMembers.length}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Heart className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Adopted Animals</dt>
											<dd className="text-lg font-semibold">{shelter.adoptedMembers.length}</dd>
										</div>
									</div>
								</div>
							</dl>
						</div>
						<GoogleMapProvider>
							<GoogleMap markers={shelterMarker} />
						</GoogleMapProvider>
					</CardContent>
				</Card>

				<Card className="h-fit">
					<CardHeader className="pt-0" />
					<CardContent>
						<div className="mb-4 flex items-center gap-3">
							<span className={cn("h-10 w-10 flex-shrink-0 rounded-md bg-secondary p-2")}>
								<Clock className={cn("min-h-full min-w-full")} aria-hidden="true" />
							</span>
							<h2 className="text-xl font-bold">{t("Working Hours")}</h2>
						</div>
						<div className="grid gap-2 md:grid-cols-2">
							{workingHours.map((item, index) => (
								<div key={index} className="flex items-center gap-2">
									<span className="w-24 text-base font-medium text-muted-foreground">{item.day}</span>
									<span className="text-base font-semibold">{item.hours}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pt-0" />
					<CardContent>
						<h2 className="text-2xl font-extrabold">About {shelter.name}</h2>
						<p>{shelter.losung} Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatibus, voluptatum, iste, voluptas quod quos dolorum accusantium laborum exercitationem culpa architecto? Quisquam, voluptatum iste voluptas quod quos dolorum.</p>
					</CardContent>
				</Card>
			</div>
		);
	}
	return null;
};

export default ShelterProfile;
