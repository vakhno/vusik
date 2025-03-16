import { ReactNode } from "react";
import UserProvider from "@/shared/zustand/provider/user.provider";
import LikedAnimalsProvider from "@/shared/zustand/provider/likedAnimals.provider";
import { UserType } from "@/entities/profile/model/type/profile";

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
