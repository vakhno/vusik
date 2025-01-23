import AnimalCardSkeleton from "@/shared/skeleton/animalCardSkeleton";
import { Button } from "@/shared/ui/button";
import AnimalCard from "@/entities/animal/ui/animalCard";
import { cn } from "@/lib/utils";
import { queryGetAllAnimals } from "@/entities/animal/model/query/animalsAllByPage";
import { AnimalType } from "@/entities/animal/model/type";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import { SearchParamsType } from "@/types/searchParams.type";
import { animalsPerPage } from "@/constants/counts";

type Props = { className?: string; animalSearchParams: SearchParamsType };

const Index = ({ className, animalSearchParams }: Props) => {
	const t = useTranslations();
	// query to get animals
	const [animals, setAnimals] = useState<AnimalType[]>([]);

	const {
		fetchNextPage,
		data: fetchedAnimals,
		isLoading: isAnimalsLoading,
		isPending,
		hasNextPage,
		isFetchingNextPage,
	} = queryGetAllAnimals({ searchParams: animalSearchParams });
	// list of animals memoizations
	useMemo(() => {
		const initialAnimals = fetchedAnimals?.pages.map((pages) => pages?.animals || []).flat() ?? [];

		setAnimals(initialAnimals);
	}, [fetchedAnimals]);

	return (
		<div className={cn(className)}>
			{!isAnimalsLoading ? (
				<div className="flex justify-center">
					{animals && animals.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
								{animals.map((animal: AnimalType) => {
									return (
										<AnimalCard isEditable={false} key={animal._id.toString()} animal={animal} />
									);
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: animalsPerPage }, (_, index) => (
											<AnimalCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{hasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => fetchNextPage()}>{t("loadMore")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("noAnimals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
					{Array.from({ length: animalsPerPage }, (_, index) => (
						<AnimalCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
