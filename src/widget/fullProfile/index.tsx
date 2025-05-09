"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { query_getProfile } from "@/entities/profile/model/query/profileByProfileId";
import UserInfoBlock from "@/features/profile/ui/userInfoBlock";
import { SearchParamsType } from "@/shared/types/searchParams.type";
import { useTranslations } from "next-intl";
// features
import ProfileAnimalsFilters from "@/features/animal/loadProfileAnimalsFilters/ui/animalsFiltersForm";
import ProfileAnimalsList from "@/features/animal/loadProfileAnimals/ui/animalsList";
import ProfileSheltersFilters from "@/features/shelter/filterProfileShelters/ui/sheltersFiltersForm";
import ProfileSheltersList from "@/features/shelter/loadProfileShelters/ui/sheltersList";
import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";

type Props = {
	userId: string;
	searchParams?: SearchParamsType;
	isEditable?: boolean;
};

const Profile = ({ userId, isEditable, searchParams = {} }: Props) => {
	const t = useTranslations();
	const { data } = query_getProfile({ userId: userId });

	if (data) {
		const { avatar, email, name, facebook, instagram, twitter, telegram, youtube } = data;
		return (
			<div className="flex flex-col items-center">
				<UserInfoBlock isEditable={isEditable} id={userId} name={name} avatar={avatar} email={email} facebook={facebook} instagram={instagram} twitter={twitter} telegram={telegram} youtube={youtube} />
				<Tabs defaultValue="shelters" className="w-full p-4">
					<TabsList className="m-auto flex">
						<TabsTrigger value="shelters" className="w-full">
							{t("page.profile.organizations.tab-trigger")}
						</TabsTrigger>
						<TabsTrigger value="pets" className="w-full">
							{t("page.profile.animals.tab-trigger")}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="shelters">
						{isEditable ? (
							<Link href="/profile/myprofile/new-shelter" className={`${buttonVariants()} my-8 w-full`}>
								{t("page.profile.organizations.new")}
							</Link>
						) : null}
						<ProfileSheltersFilters userId={userId} searchParams={searchParams} />
						<ProfileSheltersList isEditable={isEditable} id={userId} shelterSearchParams={searchParams} />
					</TabsContent>
					<TabsContent value="pets">
						{isEditable ? (
							<Link href="/profile/myprofile/new-animal" className={`${buttonVariants()} my-8 w-full`}>
								{t("page.profile.animals.new")}
							</Link>
						) : null}
						<ProfileAnimalsFilters id={userId} searchParams={searchParams} />
						<ProfileAnimalsList isEditable={isEditable} userId={userId} animalSearchParams={searchParams} />
					</TabsContent>
				</Tabs>
			</div>
		);
	}
};

export default Profile;
