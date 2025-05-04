// next tools
import Image from "next/image";
import Link from "next/link";
// shared
import { Card, CardFooter, CardHeader } from "@/shared/ui/card";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
// entities
import { AnimalType, PopulatedAnimalType } from "@/entities/animal/model/type/animal";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Copy, Pencil, Trash } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shared/ui/carousel";
import { cn } from "@/shared/lib/utils";
import { DEFAULT_ANIMAL_MAIN_IMAGE, DEFAULT_ANIMAL_SECONDARY_IMAGE } from "@/shared/constants/public";

type Props = {
	className?: string;
	isEditable: boolean;
	animal: AnimalType | PopulatedAnimalType;
	handleDelete?: () => void;
	onHandleCardClick?: () => void;
	JSXLikeButton?: React.ComponentType<{ animal: AnimalType | PopulatedAnimalType; className?: string }>;
};

const Index = ({ className, isEditable, animal, JSXLikeButton }: Props) => {
	const images = animal.mainPhoto && animal.secondaryPhotos.length ? [animal.mainPhoto, ...animal.secondaryPhotos] : [DEFAULT_ANIMAL_MAIN_IMAGE, DEFAULT_ANIMAL_SECONDARY_IMAGE, DEFAULT_ANIMAL_SECONDARY_IMAGE, DEFAULT_ANIMAL_SECONDARY_IMAGE];

	return (
		<Card className={cn(className, "relative w-full max-w-md overflow-hidden rounded-2xl border")}>
			<Carousel className="relative mx-auto w-full max-w-4xl">
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={index}>
							<AspectRatio ratio={1 / 1} className="relative h-full w-full">
								<Image src={image} alt="Pet photo" fill className="h-full w-full object-cover" />
							</AspectRatio>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
				<div className="absolute right-2 top-2 flex flex-col gap-2">
					{JSXLikeButton ? <JSXLikeButton animal={animal} /> : null}
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
				{animal.injury || animal.isNeedMedicine ? (
					<div className="absolute left-2 top-2 flex flex-col items-start gap-2">
						{!animal.injury && (
							<Badge variant="destructive" className="text-xs">
								Injured
							</Badge>
						)}
						{!animal.isNeedMedicine && (
							<Badge variant="destructive" className="text-xs">
								Needs help
							</Badge>
						)}
					</div>
				) : null}
			</Carousel>

			<CardHeader className="flex flex-col items-center gap-2 pt-4">
				<h2 className="text-2xl font-semibold">{animal.name}</h2>
				<p className="text-sm text-muted-foreground">
					{animal.species} · {animal.breed}
				</p>
				<div className="mt-2 flex flex-wrap justify-center gap-2">
					<Badge variant="outline">{animal.size}</Badge>
					<Badge variant="outline">{animal.sex}</Badge>
				</div>
			</CardHeader>

			<CardFooter className="flex items-center justify-between pt-4">
				<div className="text-lg font-semibold text-primary">{animal.isPaid ? `$${animal.fee}` : "Free"}</div>
				<Button variant="default" size="sm" asChild>
					<Link href={`/animal/${animal._id}`}>View Details</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Index;
