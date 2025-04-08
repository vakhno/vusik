// next tools
import Image from "next/image";
import Link from "next/link";
// shared
import { Card, CardContent } from "@/shared/ui/card";
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { DEFAULT_ANIMAL_MAIN_IMAGE } from "@/shared/constants/public";
import generateAgeLabel from "@/shared/utils/generateAgeLabel";
import getAgeInMonths from "@/shared/utils/getAgeInMonths";
// entities
import { AnimalType } from "@/entities/animal/model/type/animal";
// next-intl
import { useTranslations } from "next-intl";

type Props = {
	isEditable: boolean;
	animal: AnimalType;
	handleDelete?: () => void;
	onHandleCardClick?: () => void;
	JSXLikeButton: React.ComponentType<{ animal: AnimalType }>;
};

const Index = ({ isEditable, animal, onHandleCardClick, JSXLikeButton }: Props) => {
	const t = useTranslations();

	return (
		<Card className="w-full overflow-hidden">
			<Link href={`/animal/${animal._id}`} onClick={onHandleCardClick}>
				<CardContent className="relative h-full w-full overflow-hidden p-0">
					<AspectRatio ratio={2 / 3} className="relative h-full w-full">
						<Image src={animal.mainPhoto || DEFAULT_ANIMAL_MAIN_IMAGE} alt="Pet photo" fill className="h-full w-full object-cover" />
					</AspectRatio>
					<div className="flex flex-col p-2">
						<h3 className="truncate text-2xl font-bold">{animal.name}</h3>
						<div className="flex items-center">
							<span className="text-lg font-medium">{animal.species}</span>
							<span className="mx-2 font-medium">•</span>
							<span className="text-lg font-medium">{animal.breed}</span>
						</div>
						<div className="flex w-full justify-between">
							<div>Size: {animal.size}</div>
							<div>Age: {generateAgeLabel({ ageInMonths: getAgeInMonths(new Date(animal.birthday)), t })}</div>
						</div>
						<div className="flex w-full justify-between">
							<div>Sex: {animal.sex}</div>
							<div>Injured: {`${animal.injury ? "Yes" : "No"}`}</div>
						</div>
					</div>
					<div className="absolute right-1 top-0">
						<JSXLikeButton animal={animal} />
					</div>
					{isEditable ? (
						<div className="absolute left-1 top-0">
							<Link href={`/animal/${animal._id}/edit`} className="p-0">
								<Image width={40} height={40} alt="edit" src="/icons/edit.svg" />
							</Link>
						</div>
					) : null}
				</CardContent>
			</Link>
		</Card>
	);
};

export default Index;
