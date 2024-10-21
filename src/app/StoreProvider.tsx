import { ReactNode } from "react";
import UserProvider from "@/zustand/provider/user.provider";
// import SpeciesProvider from "@/zustand/provider/species.provider";
import LikedAnimalsProvider from "@/zustand/provider/likedAnimals.provider";
import { UserType } from "@/types/user.type";

type Props = {
	children: ReactNode;
	userProviderInitialData: {
		user: UserType | null;
	};
	speciesProviderInitialData?: {
		list: [];
	};
};

const StoreProvider = ({
	children,
	userProviderInitialData,
	// speciesProviderInitialData = { list: [] }
}: Props) => {
	return (
		<UserProvider preloadUser={userProviderInitialData.user}>
			<LikedAnimalsProvider>
				{/* <SpeciesProvider preloadSpecies={speciesProviderInitialData?.list}> */}
				{children}
				{/* </SpeciesProvider> */}
			</LikedAnimalsProvider>
		</UserProvider>
	);
};

export default StoreProvider;
