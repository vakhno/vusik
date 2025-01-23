"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { queryProfile } from "@/entities/profile/model/query/profileByProfileId";
import UserInfoBlock from "@/features/profile/userInfoBlock";
import AnimalTab from "@/features/profile/animalTab";
import ShelterTab from "@/features/profile/shelterTab";
import ArticleTab from "@/features/profile/articleTab";
import { Types } from "mongoose";
import { SearchParamsType } from "@/types/searchParams.type";

type Props = {
	userId: Types.ObjectId;
	searchParams?: SearchParamsType;
	isEditable?: boolean;
};

const Profile = ({ userId, isEditable, searchParams }: Props) => {
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
							Pets
						</TabsTrigger>
						<TabsTrigger value="shelters" className="w-full">
							Shelters
						</TabsTrigger>
						<TabsTrigger value="articles" className="w-full">
							Articles
						</TabsTrigger>
					</TabsList>
					<TabsContent value="pets">
						<AnimalTab isEditable={isEditable} userId={userId} searchParams={searchParams} />
					</TabsContent>
					<TabsContent value="shelters">
						<ShelterTab userId={userId} isEditable={isEditable} />
					</TabsContent>
					<TabsContent value="articles">
						<ArticleTab userId={userId} isEditable={isEditable} />
					</TabsContent>
				</Tabs>
			</div>
		);
	}
};

export default Profile;
