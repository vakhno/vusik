import { Sidebar, SidebarContent, SidebarHeader } from "@/shared/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/shared/ui/navigation-menu";

const Index = (props: React.ComponentProps<typeof Sidebar>) => {
	return (
		<Sidebar {...props}>
			<SidebarHeader className="flex h-[80px] items-center border-b border-sidebar-border">
				<Link href="/">
					<Image src="/logo/vusik-logo.svg" alt="logo" width={140} height={0} />
				</Link>
			</SidebarHeader>
			<SidebarContent className="overflow-hidden">
				<NavigationMenu className="block w-full min-w-full flex-1">
					<NavigationMenuList className="flex w-full flex-col gap-4">
						<NavigationMenuItem className="flex w-full flex-col gap-4">
							<Link href={"/"} legacyBehavior passHref>
								<NavigationMenuLink className={`flex w-full items-center justify-between`}>
									<span>Головна</span>
									<ArrowRight />
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem className="flex w-full flex-col gap-4">
							<Link href={"/animals"} legacyBehavior passHref>
								<NavigationMenuLink className={`flex w-full items-center justify-between`}>
									<span>Тваринки</span>
									<ArrowRight />
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem className="flex w-full flex-col gap-4">
							<Link href={"/shelters"} legacyBehavior passHref prefetch>
								<NavigationMenuLink className={`flex w-full items-center justify-between`}>
									<span>Притулки</span>
									<ArrowRight />
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem className="flex w-full flex-col gap-4">
							<Link href={"/articles"} legacyBehavior passHref>
								<NavigationMenuLink className={`flex w-full items-center justify-between`}>
									<span>Статті</span>
									<ArrowRight />
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</SidebarContent>
			{/* <SidebarRail /> */}
		</Sidebar>
	);
};

export default Index;
