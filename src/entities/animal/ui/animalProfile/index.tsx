"use client";

// entities
import { query_getAnimalById } from "@/entities/animal/model/query/animalById";
import { query_getAnimalsRelatedToAnimal } from "@/entities/animal/model/query/animalsRelatedToAnimal";
import generateShelterMarkers from "@/entities/shelter/model/utils/generateGoogleMapShelterMarkers";
import { AnimalType, PopulatedAnimalType } from "@/entities/animal/model/type/animal";
import AnimalCard from "@/entities/animal/ui/animalCard";
// next tools
import Image from "next/image";
// shared
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/shared/ui/carousel";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Badge } from "@/shared/ui/badge";
import { DEFAULT_ANIMAL_MAIN_IMAGE, DEFAULT_ANIMAL_SECONDARY_IMAGE } from "@/shared/constants/public";
import GoogleMap, { MarkerType } from "@/shared/shared/GoogleMap";
import GoogleMapProvider from "@/shared/providers/GoogleMapProvider";
import generateAgeLabel from "@/shared/utils/generateAgeLabel";
import getAgeInMonths from "@/shared/utils/getAgeInMonths";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
// features
import AdoptAnimalModal from "@/features/animal/adoptAnimal/ui/adoptAnimalModal";
// lucide-react
import { Dog, Tag, PawPrint, Cpu, BookCheck, Syringe, Worm, MoveUpRight, VenusAndMars, Mail, House, Ruler, Cross, Bandage, Pin, Phone, Clock } from "lucide-react";
// next-intl
import { useTranslations } from "next-intl";

type Props = { animalId: string; JSXLikeButton: React.ComponentType<{ animal: AnimalType | PopulatedAnimalType; className?: string }> };

const Index = ({ animalId, JSXLikeButton }: Props) => {
	const t = useTranslations();

	const { data: animalData } = query_getAnimalById({ animalId: animalId });
	const { data: animalseRelatedToAnimalData } = query_getAnimalsRelatedToAnimal({ animalId: animalId });

	if (animalData && animalseRelatedToAnimalData) {
		const { animal } = animalData;
		const { animals } = animalseRelatedToAnimalData;
		const mainPhoto = animal.mainPhoto || DEFAULT_ANIMAL_MAIN_IMAGE;
		const secondaryPhotos = animal.secondaryPhotos && animal.secondaryPhotos.length ? animal.secondaryPhotos : Array(3).fill(DEFAULT_ANIMAL_SECONDARY_IMAGE);
		const photos = [mainPhoto, ...secondaryPhotos];
		const shelterMarker: MarkerType[] = animal?.shelterId ? generateShelterMarkers(Object.values([animal.shelterId])) : [];

		return (
			<div className="grid gap-4 md:grid-cols-2 md:grid-rows-[auto_1fr_auto_auto]">
				<Card className="">
					<CardHeader className="pt-0" />
					<CardContent>
						<Carousel opts={{ loop: true }}>
							<CarouselContent>
								{photos.map((el, index) => (
									<CarouselItem key={index}>
										<AspectRatio ratio={4 / 3}>
											<Image src={el} alt="photo" fill className="rounded-md object-cover" />
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
					<CardHeader className="pt-0"></CardHeader>
					<CardContent className="flex h-full flex-col justify-between">
						<div className="flex flex-col">
							<div className="flex flex-col justify-between">
								<div className="mb-4 flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-extrabold">{animal.name}</h2>
										<Badge>available</Badge>
									</div>
									<JSXLikeButton animal={animal} />
								</div>
								<Card className="mb-4">
									<CardHeader className="pt-0"></CardHeader>
									<CardContent className="flex items-center justify-between">
										<div className="flex flex-col">
											<span className="text-sm font-medium">Adoption fee:</span>
											<span className="text-2xl font-bold">{animal.isPaid ? animal.fee : "NO FEE"}</span>
										</div>
										<Tag />
									</CardContent>
								</Card>
								<p>{animal.shortDescription}</p>
							</div>
							<dl className="mt-4 gap-x-4 gap-y-2">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Dog className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Species</dt>
											<dd className="text-lg font-semibold">{animal.species}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<PawPrint className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Breed</dt>
											<dd className="text-lg font-semibold">{animal.breed}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Ruler className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Size</dt>
											<dd className="text-lg font-semibold">{animal.size}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<MoveUpRight className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Age</dt>
											<dd className="text-lg font-semibold">{generateAgeLabel({ ageInMonths: getAgeInMonths(new Date(animal.birthday)), t })}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<VenusAndMars className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Sex</dt>
											<dd className="text-lg font-semibold">{animal.sex}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<House className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">State</dt>
											<dd className="text-lg font-semibold">{animal.shelterId.state}</dd>
										</div>
									</div>
								</div>
								<div>
									{animal.sterilized ? (
										<Badge>
											<Cross className="mr-1 h-5 w-5" aria-hidden="true" />
											sterilized
										</Badge>
									) : null}
									{animal.vaccinated ? (
										<Badge>
											<Syringe className="mr-1 h-5 w-5" aria-hidden="true" />
											vaccinated
										</Badge>
									) : null}
									{animal.dewormed ? (
										<Badge>
											<Worm className="mr-1 h-5 w-5" aria-hidden="true" />
											dewormed
										</Badge>
									) : null}
									{animal.passported ? (
										<Badge>
											<BookCheck className="mr-1 h-5 w-5" aria-hidden="true" />
											passported
										</Badge>
									) : null}
									{animal.microchiped ? (
										<Badge>
											<Cpu className="mr-1 h-5 w-5" aria-hidden="true" />
											microchiped
										</Badge>
									) : null}
									{animal.injury ? (
										<Badge>
											<Bandage className="mr-1 h-5 w-5" aria-hidden="true" />
											injured
										</Badge>
									) : null}
								</div>
							</dl>
						</div>
						<AdoptAnimalModal animal={animal} className="w-full" />
					</CardContent>
				</Card>
				<Card className="h-full">
					<CardHeader className="pt-0"></CardHeader>
					<CardContent>
						<h2 className="text-2xl font-extrabold">About {animal.name}</h2>
						<p>{animal.aboutMe}</p>
					</CardContent>
				</Card>

				{animal.injury ? (
					<Card className="h-fit">
						<CardHeader className="pt-0"></CardHeader>
						<CardContent>
							<h2 className="text-2xl font-extrabold">Injury description</h2>
							<p>{animal.injuryDescription} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit laboriosam ratione molestiae nobis minus vero non adipisci dicta, mollitia quam natus, et est veniam obcaecati accusamus consequatur officia quis maiores!</p>
						</CardContent>
					</Card>
				) : null}

				<Card className="flex h-full flex-col md:col-start-2 md:row-span-2">
					<CardHeader className="pt-0"></CardHeader>
					<CardContent className="flex h-full flex-col justify-between">
						<div className="flex flex-col">
							<div className="mb-4 flex items-center gap-4">
								<div>
									<h2 className="text-xl font-bold text-primary">{animal.shelterId.name}</h2>
									<p className="text-mutedforeground">{animal.shelterId.losung}</p>
								</div>
							</div>

							<dl className="mt-4 gap-x-4 gap-y-2">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Pin className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Adress</dt>
											<dd className="text-lg font-semibold">{animal.species}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Clock className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Schedule</dt>
											<dd className="text-lg font-semibold">{animal.species}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Phone className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Phone</dt>
											<dd className="text-lg font-semibold">{animal.shelterId.phone}</dd>
										</div>
									</div>
									<div className="mb-2 flex gap-3">
										<span className={cn("h-12 w-12 flex-shrink-0 rounded-md bg-secondary p-3")}>
											<Mail className={cn("min-h-full min-w-full")} aria-hidden="true" />
										</span>
										<div>
											<dt className="text-base font-medium text-muted-foreground">Mail</dt>
											<dd className="text-lg font-semibold">{animal.size}</dd>
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

				{animal.isNeedMedicine ? (
					<Card className="h-full">
						<CardHeader className="pt-0"></CardHeader>
						<CardContent>
							<h2 className="text-2xl font-extrabold">Medicine support description</h2>
							<p>{animal.needMedicineDescription} Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat praesentium impedit doloremque distinctio, architecto cupiditate molestias itaque aspernatur, nam accusamus temporibus unde minus velit a sint quasi dolorem nesciunt quos?</p>
						</CardContent>
					</Card>
				) : null}

				<Card className="overflow-hidden md:col-span-2">
					<CardHeader className="pt-0"></CardHeader>
					<CardContent>
						<h2 className="text-2xl font-extrabold">More animals like {animal.name}</h2>
						<Carousel
							opts={{
								loop: true,
							}}
						>
							<CarouselContent>
								{animals.map((animal, index) => {
									return (
										<CarouselItem key={index} className="md:basis-1/2 md:pl-4 lg:basis-1/3">
											<AnimalCard isEditable={false} animal={animal} />
										</CarouselItem>
									);
								})}
							</CarouselContent>
							<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
							<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
						</Carousel>
					</CardContent>
				</Card>
			</div>
		);
	}
	return null;
};

export default Index;
