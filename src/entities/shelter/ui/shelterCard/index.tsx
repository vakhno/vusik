// next tools
import Image from "next/image";
import Link from "next/link";
// shared
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardFooter } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";
// icons
import { DEFAULT_SHELTER_MAIN_IMAGE, DEFAULT_SHELTER_SECONDARY_IMAGE } from "@/shared/constants/public";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/ui/carousel";
import { MapPin, Phone, Building, Copy, Pencil, Trash } from "lucide-react";

type Props = {
	shelter: ShelterType;
	isEditable?: boolean;
};

const Index = ({ shelter, isEditable = false }: Props) => {
	const images = shelter.mainPhoto && shelter.secondaryPhotos.length ? [shelter.mainPhoto, ...shelter.secondaryPhotos] : [DEFAULT_SHELTER_MAIN_IMAGE, DEFAULT_SHELTER_SECONDARY_IMAGE, DEFAULT_SHELTER_SECONDARY_IMAGE, DEFAULT_SHELTER_SECONDARY_IMAGE];

	return (
		<Card className="relative w-full max-w-2xl overflow-hidden rounded-2xl border">
			<Carousel className="relative mx-auto w-full max-w-4xl">
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index}>
							<AspectRatio ratio={16 / 9} className="relative h-full w-full">
								<Image src={image} alt="Shelter photo" fill className="h-full w-full object-cover" />
							</AspectRatio>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
				<div className="absolute right-2 top-2 flex flex-col gap-2">
					{isEditable ? (
						<>
							<Button asChild className="h-14 w-14 flex-shrink-0 rounded-md p-3" aria-label="Edit">
								<Link href="/">
									<Pencil className="min-h-full min-w-full" />
								</Link>
							</Button>
							<Button asChild className="h-14 w-14 flex-shrink-0 rounded-md p-3" aria-label="Dublicate">
								<Link href="/">
									<Copy className="min-h-full min-w-full" />
								</Link>
							</Button>
							<Button className="h-14 w-14 flex-shrink-0 rounded-md p-3" variant={"destructive"} aria-label="Delete">
								<Trash className="min-h-full min-w-full" />
							</Button>
						</>
					) : null}
				</div>
			</Carousel>

			<CardHeader className="flex flex-col items-center gap-2 pt-4">
				<h2 className="text-2xl font-semibold">{shelter.name}</h2>
				<Badge variant={shelter.isCharitable ? "default" : "secondary"} className="mt-1">
					{shelter.isCharitable ? "Charitable" : "Private"}
				</Badge>

				<div className="w-full space-y-2 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4" />
						<span>
							{shelter.country}, {shelter.city}
							{shelter.street ? `, ${shelter.street}` : ""}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Phone className="h-4 w-4" />
						<span>{shelter.phone}</span>
					</div>
					{shelter.losung && (
						<div className="flex items-center gap-2">
							<Building className="h-4 w-4" />
							<span>{shelter.losung}</span>
						</div>
					)}
				</div>
			</CardHeader>

			<CardFooter className="flex items-center justify-between pt-4">
				<Button variant="default" size="sm" className="w-full" asChild>
					<Link href={`/shelter/${shelter._id}`}>View Details</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Index;
