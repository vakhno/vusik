"use server";

// screen
import Profile from "@/screens/profile";
// next tools
import { Metadata } from "next";
// shared
import { getCookiesId } from "@/shared/utils/cookies";
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
