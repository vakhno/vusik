"use server";

// screen
import ProfileScreen from "@/screens/myprofile";
// next tools
import { Metadata } from "next";
// shared
import { SearchParamsType } from "@/shared/types/searchParams.type";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "",
		description: "",
	};
}

type Props = {
	searchParams: SearchParamsType;
};

const Page = ({ searchParams }: Props) => {
	return <ProfileScreen searchParams={searchParams} />;
};

export default Page;
