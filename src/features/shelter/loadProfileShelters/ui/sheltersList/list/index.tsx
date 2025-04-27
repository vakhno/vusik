"use client";

// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import ShelterCard from "@/entities/shelter/ui/shelterCard";
import ShelterCardSkeleton from "@/entities/shelter/ui/shelterCardSkeleton";
// next-intl
import { useTranslations } from "next-intl";
// shared
import { Button } from "@/shared/ui/button";

type Props = {
	isEditable?: boolean;
	isLoading: boolean;
	isPending: boolean;
	isFetchingNextPage: boolean;
	isHasNextPage: boolean;
	shelters: ShelterType[];
	countPerPage: number;
	onNewPageUpload: () => void;
};

const Index = ({ isEditable = false, isLoading, isPending, isFetchingNextPage, isHasNextPage, shelters, countPerPage, onNewPageUpload }: Props) => {
	const t = useTranslations();
	const handleNewPageUpload = () => {
		onNewPageUpload();
	};

	return (
		<div>
			{!isLoading ? (
				<div className="flex justify-center">
					{shelters && shelters.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
								{shelters.map((shelter: ShelterType) => {
									return <ShelterCard isEditable={isEditable} key={shelter._id.toString()} shelter={shelter} />;
								})}
								{isFetchingNextPage || isPending ? (
									<>
										{Array.from({ length: countPerPage }, (_, index) => (
											<ShelterCardSkeleton key={index} />
										))}
									</>
								) : null}
							</div>

							{isHasNextPage ? (
								<div className="m-auto">
									<Button onClick={() => handleNewPageUpload()}>{t("page.animals.load-more")}</Button>
								</div>
							) : null}
						</div>
					) : (
						<span>{t("page.animals.no-animals")}</span>
					)}
				</div>
			) : (
				<div className="m-auto grid h-full w-full grid-cols-auto-fit-260-1fr gap-4">
					{Array.from({ length: countPerPage }, (_, index) => (
						<ShelterCardSkeleton key={index} />
					))}
				</div>
			)}
		</div>
	);
};

export default Index;
