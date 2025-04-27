// next tools
import Image from "next/image";
import Link from "next/link";
// shared
import { AspectRatio } from "@/shared/ui/aspect-ratio";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";

type Props = {
	shelter: ShelterType;
	isEditable?: boolean;
};

const Index = ({ shelter, isEditable = false }: Props) => {
	return (
		<Card className="w-full bg-secondary">
			<Link href={`/shelter/${shelter._id}`}>
				<CardContent className="relative h-full w-full overflow-hidden p-2">
					<div className="grid grid-cols-1 lg:grid-cols-2">
						<AspectRatio ratio={5 / 3} className="relative h-full w-full">
							{shelter?.mainPhoto ? <Image src={shelter.mainPhoto} alt="Shelter photo" fill className="h-full w-full object-cover" /> : null}
						</AspectRatio>
						<div className="flex flex-col justify-between p-4">
							<div className="flex flex-col">
								<h2>{shelter.name}</h2>
								<span>
									{shelter.country}, {shelter.city}, {shelter.street}
								</span>
								<span>{shelter.phone}</span>
							</div>
							<Button>More</Button>
						</div>
					</div>
				</CardContent>
			</Link>
			{isEditable ? (
				<div className="absolute left-1 top-0">
					<Link href={`/shelter/${shelter._id}/edit`} className="p-0">
						<Image width={40} height={40} alt="edit" src="/icons/edit.svg" />
					</Link>
				</div>
			) : null}
		</Card>
	);
};

export default Index;
