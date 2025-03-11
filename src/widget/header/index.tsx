"use client";
// widgets
import LocaleSwitcher from "@/widget/localeSwitcher";
import LikedAnimals from "@/widget/likedAnimalsModal";
// zustand
import useUserStore from "@/zustand/store/user.store";
// UI components
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
// next tools
import Image from "next/image";
// UI components
import { Avatar, AvatarImage } from "@/shared/ui/avatar";
// UI components
import { UserType } from "@/entities/profile/model/type/profile";
// next-intl
import { useTranslations } from "next-intl";
// UI components
import { buttonVariants } from "@/shared/ui/button";
// next tools
import Link from "next/link";
// libs
import { cn } from "@/lib/utils";
// routes
import { PROFILE_ROUTE } from "@/routes";
import { SidebarTrigger } from "@/shared/ui/sidebar";
import Sidebar from "@/widget/sidebar";
// features
import LogoutButton from "@/features/auth/logout/ui/logoutButton";

interface Props {
	className?: string;
}

const Header = ({ className }: Props) => {
	const t = useTranslations();
	const user = useUserStore((state) => state.user) as UserType;

	return (
		<header
			className={cn(className, "sticky top-0 z-10 h-[80px] w-full overflow-x-clip border-b backdrop-blur-md")}
		>
			<div className="flex h-full w-full items-center justify-between px-4">
				<Link href="/">
					<Image src="/logo/vusik-logo.svg" alt="logo" width={140} height={0} />
				</Link>

				<div className="flex h-[inherit] items-center gap-2">
					<LikedAnimals />
					<LocaleSwitcher />
					{user ? (
						<Popover>
							<PopoverTrigger>
								<Avatar className="group relative flex cursor-pointer items-center justify-center rounded-full bg-white dark:bg-black">
									{user.avatar ? (
										<AvatarImage
											className="pointer-events-none h-full w-full"
											alt={t("avatar.custom-avatar-alt-label")}
											src={user.avatar}
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
							</PopoverTrigger>
							<PopoverContent>
								<div className="flex flex-col">
									<Link href={`${PROFILE_ROUTE}/${user._id}`}>Profile</Link>
									<LogoutButton />
								</div>
							</PopoverContent>
						</Popover>
					) : (
						<Link
							href="/auth/sign-in"
							className={cn(buttonVariants({ variant: "secondary" }))}
							prefetch={true}
						>
							{t("auth.sign-in-label")}
						</Link>
					)}
					<SidebarTrigger className="rotate-180" />
					<Sidebar side="right" className="fixed top-0" />
				</div>
			</div>
		</header>
	);
};

export default Header;
