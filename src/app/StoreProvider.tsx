import { ReactNode } from "react";
import UserProvider from "@/zustand/provider/user.provider";
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

const StoreProvider = ({ children, userProviderInitialData }: Props) => {
	return (
		<UserProvider preloadUser={userProviderInitialData.user}>
			<LikedAnimalsProvider>{children}</LikedAnimalsProvider>
		</UserProvider>
	);
};

export default StoreProvider;
