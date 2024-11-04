"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryProfile } from "@/queries/profile.query";
import UserInfoBlock from "@/features/profile/userInfoBlock";
import AnimalTab from "@/features/profile/animalTab";
import ShelterTab from "@/features/profile/shelterTab";
import { Types } from "mongoose";

type Props = {
	userId: Types.ObjectId;
	searchParams?: Record<string, string | string[]>;
	isEditable?: boolean;
};

const Profile = ({ userId, isEditable, searchParams }: Props) => {
	const { data } = queryProfile({ userId: userId });
	if (data) {
		const shelters = data?.shelters;
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
					</TabsList>
					<TabsContent value="pets">
						<AnimalTab
							isEditable={isEditable}
							shelters={shelters}
							userId={userId}
							searchParams={searchParams}
						/>
					</TabsContent>
					<TabsContent value="shelters">
						<ShelterTab userId={userId} isEditable={isEditable} shelters={shelters} />
					</TabsContent>
				</Tabs>
			</div>
		);
	}
};

export default Profile;
