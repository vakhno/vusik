"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { queryProfile } from "@/entities/profile/model/query/profileByProfileId";
import UserInfoBlock from "@/features/profile/userInfoBlock";
import { Types } from "mongoose";
import { SearchParamsType } from "@/types/searchParams.type";
import { useTranslations } from "next-intl";
// features
import ProfileAnimalsFilters from "@/features/animal/loadProfileAnimalsFilters/ui/animalsFiltersForm";
import ProfileAnimalsList from "@/features/animal/loadProfileAnimals/ui/animalsList";
import ProfileSheltersFilters from "@/features/shelter/loadProfileSheltersFilters/ui/sheltersFiltersForm";
import ProfileSheltersList from "@/features/shelter/loadProfileShelters/ui/sheltersList";
import ProfileArticlesFilters from "@/features/article/loadProfileArticlesFilters/ui/articlesFiltersForm";
import ProfileArticlesList from "@/features/article/loadProfileArticles/ui/articlesList";
import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";

type Props = {
	userId: Types.ObjectId;
	searchParams?: SearchParamsType;
	isEditable?: boolean;
};

const Profile = ({ userId, isEditable, searchParams }: Props) => {
	const t = useTranslations();
	const { data } = queryProfile({ userId: userId });
	if (data) {
		const { avatar, email, name, facebook, instagram, twitter, telegram, youtube } = data;
		return (
			<div className="flex flex-col items-center">
				<UserInfoBlock
					isEditable={isEditable}
					id={userId}
					name={name}
					avatar={avatar}
					email={email}
					facebook={facebook}
					instagram={instagram}
					twitter={twitter}
					telegram={telegram}
					youtube={youtube}
				/>
				<Tabs defaultValue="pets" className="w-full p-4">
					<TabsList className="m-auto flex">
						<TabsTrigger value="pets" className="w-full">
							{t("page.profile.animals.tab-trigger")}
						</TabsTrigger>
						<TabsTrigger value="shelters" className="w-full">
							{t("page.profile.organizations.tab-trigger")}
						</TabsTrigger>
						<TabsTrigger value="articles" className="w-full">
							{t("page.profile.articles.tab-trigger")}
						</TabsTrigger>
					</TabsList>
					<TabsContent value="pets">
						{isEditable ? (
							<Link href="/profile/myprofile/new-animal" className={`${buttonVariants()} my-8 w-full`}>
								{t("page.profile.animals.new")}
							</Link>
						) : null}
						<ProfileAnimalsFilters id={userId} searchParams={searchParams} />
						<ProfileAnimalsList isEditable={isEditable} userId={userId} animalSearchParams={searchParams} />
					</TabsContent>
					<TabsContent value="shelters">
						{isEditable ? (
							<Link href="/profile/myprofile/new-shelter" className={`${buttonVariants()} my-8 w-full`}>
								{t("page.profile.organizations.new")}
							</Link>
						) : null}
						<ProfileSheltersFilters id={userId} searchParams={searchParams} />
						<ProfileSheltersList isEditable={isEditable} id={userId} shelterSearchParams={searchParams} />
					</TabsContent>
					<TabsContent value="articles">
						{isEditable ? (
							<Link href="/profile/myprofile/new-article" className={`${buttonVariants()} my-8 w-full`}>
								{t("page.profile.articles.new")}
							</Link>
						) : null}
						<ProfileArticlesFilters id={userId} searchParams={searchParams} />
						<ProfileArticlesList isEditable={isEditable} id={userId} articleSearchParams={searchParams} />
					</TabsContent>
				</Tabs>
			</div>
		);
	}
};

export default Profile;
