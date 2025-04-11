"use server";

// screen
import ProfileScreen from "@/screens/profile";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";
// next tools
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "",
		description: "",
	};
}

type Props = {
	params: { userId: string };
	searchParams: SearchParamsType;
};

const Page = ({ params, searchParams }: Props) => {
	return <ProfileScreen params={params} searchParams={searchParams} />;
};

export default Page;
