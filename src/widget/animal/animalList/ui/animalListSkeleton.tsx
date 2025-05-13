// entities
import AnimalCardSkeleton from "@/entities/animal/ui/animalCardSkeleton";

type Props = {
	countOfSkeletons: number;
};

const index = ({ countOfSkeletons }: Props) => {
	return (
		<div className="m-auto grid h-full w-full grid-cols-auto-fit-320-1fr gap-4">
			{Array.from({ length: countOfSkeletons }, (_, index) => (
				<AnimalCardSkeleton key={index} />
			))}
		</div>
	);
};

export default index;
