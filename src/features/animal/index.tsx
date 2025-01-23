"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { queryAnimal } from "@/entities/animal/model/query/animalById";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
// import { useTranslations } from "next-intl";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/shared/ui/carousel";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import Link from "next/link";
import { MapProvider } from "@/widget/googleMap/mapProvider";
import { MapComponent } from "@/widget/googleMap/map";
import AdopAnimalForm from "@/features/animal/adoptAnimal/ui/adoptAnimalForm";
import { Types } from "mongoose";
type Props = { animalId: Types.ObjectId };

const Index = ({ animalId }: Props) => {
	// const t = useTranslations();
	const [carouselApi, setCarouselApi] = useState<CarouselApi>(undefined);
	const [miniCarouselApi, setMiniCarouselApi] = useState<CarouselApi>(undefined);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const { data } = queryAnimal({ animalId: animalId });

	const [isAdoptModalOpened, setIsAdoptModalOpened] = useState<boolean>(false);

	// useEffect(() => {
	// 	if (!miniCarouselApi) return;
	// 	miniCarouselApi.on("select", (e) => {
	// 		console.log("11", e.selectedScrollSnap());
	// 	});
	// 	miniCarouselApi.selectedScrollSnap();
	// }, [miniCarouselApi]);

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
		const photos = [animal.mainPhoto, ...animal.secondaryPhotos];

		return (
			<>
				<Dialog
					onOpenChange={setIsAdoptModalOpened}
					open={isAdoptModalOpened}
					modal
					defaultOpen={isAdoptModalOpened}
				>
					<DialogContent className="max-w-[720px]">
						<DialogHeader>
							<DialogTitle>ADOPT</DialogTitle>
						</DialogHeader>
						<div className="flex h-full items-center space-x-2 overflow-auto">
							<AdopAnimalForm />
						</div>
					</DialogContent>
				</Dialog>
				<div className="flex gap-10">
					<div className="flex-1">
						<Carousel
							// className="m-auto w-full max-w-xs"
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
							{/* <CarouselPrevious />
							<CarouselNext /> */}
						</Carousel>

						<Carousel
							// className="m-auto w-full max-w-xs"
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
					<div className="flex flex-1 flex-col items-center">
						<h2>{animal.name}</h2>
						<div className="w-full flex-1">
							<div>
								<span>Species:</span>
								<span>{animal.species}</span>
							</div>
							<div>
								<span>Breed:</span>
								<span>{animal.breed}</span>
							</div>
							<div>
								<span>Age:</span>
								<span>{animal.age}</span>
							</div>
							<div>
								<span>Sex:</span>
								<span>{animal.sex}</span>
							</div>
							<div>
								<span>Size:</span>
								<span>{animal.size}</span>
							</div>
							<div>
								<span>Owner:</span>
								<span>
									<Link href={`/profile/${animal.userId._id}`}>{animal.userId.name}</Link>
								</span>
							</div>
							<div>
								<span>Shelter:</span>
								<span>
									<Link href={`/shelter/${shelter._id}`}>{shelter.name}</Link>
								</span>
							</div>
							<div>
								<span>Sterilized:</span>
								<span>{JSON.stringify(animal.sterilized)}</span>
							</div>
						</div>
						<Button onClick={() => setIsAdoptModalOpened(!isAdoptModalOpened)}>ADOPT</Button>
					</div>
				</div>
				<div className="flex h-60 flex-col px-10">
					<MapProvider>
						<MapComponent
							centerCoordinates={shelter.coordinates}
							markerCoordinates={[shelter.coordinates]}
						/>
					</MapProvider>
				</div>
			</>
		);
	}
	return null;
};

export default Index;
