"use client";

import { useEffect, useState } from "react";
import { queryAnimal } from "@/entities/animal/model/query/animalById";
import Image from "next/image";
// import { useTranslations } from "next-intl";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/shared/ui/carousel";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import Link from "next/link";
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent } from "@/widget/googleMap/map";
import { Types } from "mongoose";
import AdoptAnimalModal from "@/widget/adoptAnimalModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

type Props = { animalId: Types.ObjectId };

const Index = ({ animalId }: Props) => {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>(undefined);
	const [miniCarouselApi, setMiniCarouselApi] = useState<CarouselApi>(undefined);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const { data } = queryAnimal({ animalId: animalId });

	useEffect(() => {
		if (!carouselApi || !miniCarouselApi) return;
		carouselApi.on("select", (e) => {
			const slideIndex = e.selectedScrollSnap();
			miniCarouselApi.scrollTo(slideIndex);
			setSelectedIndex(slideIndex);
		});
	}, [carouselApi, miniCarouselApi]);

	const setFocusSlide = (slide: number) => {
		carouselApi?.scrollTo(slide);
		setSelectedIndex(slide);
	};

	if (data) {
		const { animal, shelter } = data;

		const mainPhoto = animal.mainPhoto || "/images/default-animal.jpg";
		const secondaryPhotos = animal.secondaryPhotos.length
			? animal.secondaryPhotos
			: Array(3).fill("/images/default_animal_2.jpg");
		const photos = [mainPhoto, ...secondaryPhotos];

		return (
			<>
				<div className="container mx-auto max-w-3xl p-6">
					<Card className="overflow-hidden">
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
									align: "center",
									dragFree: true,
								}}
							>
								<CarouselContent>
									{photos.map((el, index) => {
										return (
											<CarouselItem
												key={index}
												className={`basis-1/3 ${index === selectedIndex ? "scale-[80%]" : ""}`}
												onClick={() => setFocusSlide(index)}
											>
												<AspectRatio ratio={4 / 3}>
													<Image src={el} fill alt="photo" className="object-cover" />
												</AspectRatio>
											</CarouselItem>
										);
									})}
								</CarouselContent>
							</Carousel>
						</div>

						<CardHeader>
							<CardTitle className="text-2xl">{animal.name}</CardTitle>
						</CardHeader>
						<CardContent className="text-gray-700">
							<p>
								<strong>Species:</strong> {animal.species}
							</p>
							<p>
								<strong>Breed:</strong> {animal.breed}
							</p>
							<p>
								<strong>Size:</strong> {animal.size}
							</p>
							<p>
								<strong>Age:</strong> {animal.age} years
							</p>
							<p>
								<strong>Sex:</strong> {animal.sex}
							</p>
							<p>
								<strong>Sterilized:</strong>{" "}
								{animal.sterilized ? (
									<Badge className="bg-green-500">Yes</Badge>
								) : (
									<Badge className="bg-red-500">No</Badge>
								)}
							</p>
							{animal.injury && (
								<p className="text-red-600">
									<strong>Injury:</strong> {animal.injuryDescription || "No details provided"}
								</p>
							)}
							<div>
								<strong>Shelter :</strong>
								<Link href={`/shelter/${shelter._id}`}>{shelter.name}</Link>
							</div>
							<AdoptAnimalModal />
							<div className="flex h-60 flex-col px-10">
								<MapProvider>
									<MapComponent
										centerCoordinates={shelter.coordinates}
										markerCoordinates={[shelter.coordinates]}
									/>
								</MapProvider>
							</div>
						</CardContent>
					</Card>
				</div>
			</>
		);
	}
	return null;
};

export default Index;
