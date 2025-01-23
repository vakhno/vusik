import TextWithClipboardCopy from "@/shared/shared/TextWithClipboardCopy";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import EditProfileModal from "./editProfileModal";
import { useState } from "react";
import { EditUserSchemaType } from "@/entities/profile/model/type/editProfileForm";
import { Types } from "mongoose";
import { useToast } from "@/shared/ui/use-toast";

type Props = {
	id: Types.ObjectId;
	avatar: string;
	name: string;
	email: string;
	isEditable?: boolean;
	facebook?: string;
	instagram?: string;
	twitter?: string;
	telegram?: string;
	youtube?: string;
};

const Index = ({
	id,
	avatar,
	name,
	email,
	isEditable = false,
	facebook,
	instagram,
	twitter,
	telegram,
	youtube,
}: Props) => {
	const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
	const { toast } = useToast();

	const handleProfileEdit = () => {
		setIsEditUserModalVisible(!isEditUserModalVisible);
	};

	const handleSubmitClick = async (data: EditUserSchemaType) => {
		const { avatar, name, facebook, telegram, twitter, instagram, youtube } = data;

		const formData = new FormData();

		formData.append("id", id.toString());
		formData.append("name", name);
		formData.append("facebook", facebook || "");
		formData.append("telegram", telegram || "");
		formData.append("twitter", twitter || "");
		formData.append("instagram", instagram || "");
		formData.append("youtube", youtube || "");

		if (avatar) {
			formData.append("avatar", avatar);
		}

		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/user/put-edit-profile`, {
			method: "PUT",
			body: formData,
		});

		const { ok } = response;

		if (ok) {
			const data = await response.json();
			const { success } = data;
			if (success) {
				// profileMutation.mutate(userId);
				// setIsEditAnimalOpened(false);
				toast({
					title: "Success",
					description: `Edited`,
					variant: "default",
				});
			} else {
				toast({
					title: "Error",
					description: `Something went wrong`,
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Error",
				description: `Something went wrong`,
				variant: "destructive",
			});
		}
	};

	return (
		<>
			{isEditable ? (
				isEditUserModalVisible ? (
					<EditProfileModal
						modalTitle="Edit profile"
						submitButtonTitle="Submit"
						isOpen={isEditUserModalVisible}
						closeButtonTitle="Close"
						deleteButtonTitle="Delete"
						mainPhotoValue={avatar}
						setIsOpen={setIsEditUserModalVisible}
						handleSuccessSubmitClick={handleSubmitClick}
						nameValue={name}
						facebookValue={facebook}
						instagramValue={instagram}
						twitterValue={twitter}
						telegramValue={telegram}
						youtubeValue={youtube}
					/>
				) : null
			) : null}
			<Avatar className="group relative m-auto h-60 w-60">
				{avatar ? (
					<AvatarImage src={avatar} referrerPolicy="no-referrer" />
				) : (
					<AvatarImage src="/icons/default-profile-icon.svg" />
				)}
			</Avatar>
			<span className="font-roboto text-2xl font-medium">{name}</span>
			<TextWithClipboardCopy
				className="font-concert_one text-xl"
				text={email}
				copyText={email}
				isToastShow
				toastTitle="Coppied"
				toastDescription="Email coppied to clipboard"
			/>
			<div className="mb-4 flex gap-2">
				{facebook ? (
					<Link href={facebook}>
						<Image src="/icons/social/facebook-round.svg" alt="Facebook logo" width={50} height={50} />
					</Link>
				) : null}
				{instagram ? (
					<Link href={instagram}>
						<Image src="/icons/social/instagram-round.svg" alt="Instagram logo" width={50} height={50} />
					</Link>
				) : null}
				{telegram ? (
					<Link href={telegram}>
						<Image src="/icons/social/telegram-round.svg" alt="Telegram logo" width={50} height={50} />
					</Link>
				) : null}
				{twitter ? (
					<Link href={twitter}>
						<Image src="/icons/social/twitter-round.svg" alt="Twitter logo" width={50} height={50} />
					</Link>
				) : null}
				{youtube ? (
					<Link href={youtube}>
						<Image src="/icons/social/youtube-round.svg" alt="Youtube logo" width={50} height={50} />
					</Link>
				) : null}
			</div>
			{isEditable ? <Button onClick={handleProfileEdit}>Edit profile</Button> : null}
		</>
	);
};

export default Index;
