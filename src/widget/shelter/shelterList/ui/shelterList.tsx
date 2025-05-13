// widgets
import ShelterListSkeleton from "@/widget/shelter/shelterList/ui/shelterListSkeleton";
// entities
import { ShelterType } from "@/entities/shelter/model/type/shelter";
import ShelterCard from "@/entities/shelter/ui/shelterCard";

type Props = {
	isLoading: boolean;
	shelters: ShelterType[];
	isEditable: boolean;
	isFetching: boolean;
};

const index = ({ isLoading, shelters, isEditable, isFetching }: Props) => {
	return (
		<>
			{!isLoading ? (
				<div className="flex justify-center">
					{shelters && shelters.length ? (
						<div className="flex w-full flex-col">
							<div className="m-auto grid h-full w-full grid-cols-auto-fit-460-1fr gap-4">
								{shelters.map((shelter: ShelterType) => {
									return (
										<ShelterCard
											isEditable={isEditable}
											key={shelter._id.toString()}
											shelter={shelter}
										/>
									);
								})}
								{isFetching ? (
									<>
										<ShelterListSkeleton countOfSkeletons={10} />
									</>
								) : null}
							</div>
						</div>
					) : (
						<span>no shelters yet</span>
					)}
				</div>
			) : (
				<ShelterListSkeleton countOfSkeletons={10} />
			)}
		</>
	);
};

export default index;
