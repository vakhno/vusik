// entities
import AnimalCardSkeleton from "@/entities/animal/ui/animalCardSkeleton";

type Props = {
	countOfSkeletons: number;
};

const index = ({ countOfSkeletons }: Props) => {
	return (
		<div className="grid-cols-auto-fit-460-1fr m-auto grid h-full w-full gap-4">
			{Array.from({ length: countOfSkeletons }, (_, index) => (
				<AnimalCardSkeleton key={index} />
			))}
		</div>
	);
};

export default index;
