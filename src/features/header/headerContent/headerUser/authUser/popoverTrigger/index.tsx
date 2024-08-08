"use client";
// next tools
import Image from "next/image";
// UI components
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

interface Props {
	avatar: string;
}

const PopoverTrigger = ({ avatar }: Props) => {
	const t = useTranslations();

	return (
		<Avatar className="group relative flex cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black">
			{avatar ? (
				<AvatarImage
					className="pointer-events-none h-full w-full"
					alt={t("avatar.custom-avatar-alt-label")}
					src={avatar}
				/>
			) : (
				<Image
					className="absolute h-6 w-6 items-center justify-center dark:fill-white"
					alt={t("avatar.default-avatar-alt-label")}
					src="/icons/default-profile-icon.svg"
					width={26}
					height={26}
				/>
			)}
		</Avatar>
	);
};

export default PopoverTrigger;
