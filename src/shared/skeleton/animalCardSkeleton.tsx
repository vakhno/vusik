// UI components
import { Skeleton } from "@/shared/ui/skeleton";
import { AspectRatio } from "@/shared/ui/aspect-ratio";

const animalCardSkeleton = () => {
	return (
		<AspectRatio ratio={2 / 3}>
			<Skeleton className="h-full w-full rounded-xl" />
		</AspectRatio>
	);
};

export default animalCardSkeleton;
