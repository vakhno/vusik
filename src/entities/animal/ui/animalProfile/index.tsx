"use client";

// react
import { useEffect, useState } from "react";
// entities
import { query_getAnimalById } from "@/entities/animal/model/query/animalById";
import generateShelterMarkers from "@/entities/shelter/model/utils/generateGoogleMapShelterMarkers";
// next tools
import Image from "next/image";
import Link from "next/link";
// shared
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/shared/ui/carousel";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Badge } from "@/shared/ui/badge";
import { DEFAULT_ANIMAL_MAIN_IMAGE, DEFAULT_ANIMAL_SECONDARY_IMAGE } from "@/shared/constants/public";
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import generateAgeLabel from "@/shared/utils/generateAgeLabel";
// features
import AdoptAnimalModal from "@/features/animal/adoptAnimal/ui/adoptAnimalModal";
// mongoose
import { Types } from "mongoose";
import getAgeInMonths from "@/shared/utils/getAgeInMonths";
// lucide-react
import { Dog, PawPrint, Cpu, BookCheck, Syringe, Worm, MoveUpRight, VenusAndMars, House, Ruler, Cross, Bandage } from "lucide-react";
// next-intl
import { useTranslations } from "next-intl";

type Props = { animalId: Types.ObjectId };

const Index = ({ animalId }: Props) => {
	const t = useTranslations();
	const [carouselApi, setCarouselApi] = useState<CarouselApi>(undefined);
	const [miniCarouselApi, setMiniCarouselApi] = useState<CarouselApi>(undefined);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const { data } = query_getAnimalById({ animalId: animalId });

	useEffect(() => {
		if (!carouselApi || !miniCarouselApi) return;
		carouselApi.on("select", (e) => {
			const slideIndex = e.selectedScrollSnap();
			miniCarouselApi.scrollTo(slideIndex);
			setSelectedIndex(slideIndex);
		});
	}, [carouselApi, miniCarouselApi]);

	const setFocusSlide = (slide: number) => {
		if (!carouselApi) return;
		carouselApi.scrollTo(slide);
	};

	if (data) {
		const { animal } = data;
		const mainPhoto = animal.mainPhoto || DEFAULT_ANIMAL_MAIN_IMAGE;
		const secondaryPhotos = animal.secondaryPhotos && animal.secondaryPhotos.length ? animal.secondaryPhotos : Array(3).fill(DEFAULT_ANIMAL_SECONDARY_IMAGE);
		const photos = [mainPhoto, ...secondaryPhotos];
		const shelterMarker: MarkerType[] = animal?.shelterId ? generateShelterMarkers(Object.values([animal.shelterId])) : [];
		console.log("animal", animal);
		return (
			<div className="container mx-auto max-w-6xl p-6">
				<div className="flex-1">
					<Carousel
						setApi={setCarouselApi}
						opts={{
							align: "center",
							loop: true,
						}}
					>
						<CarouselContent>
							{photos.map((el, index) => {
								return (
									<CarouselItem key={index}>
										<AspectRatio ratio={4 / 3}>
											<Image src={el} fill alt="photo" className="object-cover" />
										</AspectRatio>
									</CarouselItem>
								);
							})}
						</CarouselContent>
					</Carousel>

					<Carousel
						setApi={setMiniCarouselApi}
						opts={{
							containScroll: "keepSnaps",
							align: "center",
							dragFree: true,
						}}
					>
						<CarouselContent>
							{photos.map((el, index) => {
								return (
									<CarouselItem key={index} className={`basis-1/3 ${index === selectedIndex ? "scale-[60%]" : ""}`} onClick={() => setFocusSlide(index)}>
										<AspectRatio ratio={4 / 3}>
											<Image src={el} fill alt="photo" className="object-cover" />
										</AspectRatio>
									</CarouselItem>
								);
							})}
						</CarouselContent>
					</Carousel>
				</div>

				<h2 className="text-4xl font-extrabold">{animal.name}</h2>
				<dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
					<div className="flex items-center gap-2">
						<Dog className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Species:</dt>
						<dd>{animal.species}</dd>
					</div>
					<div className="flex items-center gap-2">
						<PawPrint className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Breed:</dt>
						<dd>{animal.breed}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Ruler className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Size:</dt>
						<dd>{animal.size}</dd>
					</div>
					<div className="flex items-center gap-2">
						<MoveUpRight className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Age:</dt>
						<dd>{generateAgeLabel({ ageInMonths: getAgeInMonths(new Date(animal.birthday)), t })}</dd>
					</div>
					<div className="flex items-center gap-2">
						<VenusAndMars className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Sex:</dt>
						<dd>{animal.sex}</dd>
					</div>
					<div className="flex items-center gap-2">
						<House className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Shelter:</dt>
						<dd>
							<Link href={`/shelter/${animal.shelterId._id}`}>{animal.shelterId.name}</Link>
						</dd>
					</div>
					<div className="flex items-center gap-2">
						<Cross className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Sterilized:</dt>
						<dd>{animal.sterilized ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Syringe className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Vaccinated:</dt>
						<dd>{animal.vaccinated ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Worm className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Dewormed:</dt>
						<dd>{animal.dewormed ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</dd>
					</div>
					<div className="flex items-center gap-2">
						<BookCheck className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Passported:</dt>
						<dd>{animal.passported ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Cpu className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Microchiped:</dt>
						<dd>{animal.microchiped ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</dd>
					</div>
					<div className="flex items-center gap-2">
						<Bandage className="h-5 w-5" aria-hidden="true" />
						<dt className="font-semibold">Injured:</dt>
						<dd>{animal.injury ? <Badge className="bg-green-500">Yes</Badge> : <Badge className="bg-red-500">No</Badge>}</dd>
					</div>
				</dl>
				{animal.injury && (
					<p className="text-red-600">
						<strong>Injury:</strong> {animal.injuryDescription || "No details provided"}
					</p>
				)}

				<AdoptAnimalModal animal={animal} />
				<GoogleMapProvider>
					<GoogleMap markers={shelterMarker} />
				</GoogleMapProvider>
			</div>
		);
	}
	return null;
};

export default Index;
