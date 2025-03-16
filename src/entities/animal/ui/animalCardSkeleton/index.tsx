// shared
import { Skeleton } from "@/shared/ui/skeleton";
import { AspectRatio } from "@/shared/ui/aspect-ratio";

const index = () => {
	return (
		<AspectRatio ratio={2 / 3}>
			<Skeleton className="h-full w-full rounded-xl" />
		</AspectRatio>
	);
};

export default index;
