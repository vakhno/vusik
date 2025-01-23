// import {
// 	Sidebar,
// 	SidebarContent,
// 	SidebarFooter,
// 	SidebarGroup,
// 	SidebarGroupContent,
// 	SidebarGroupLabel,
// 	SidebarHeader,
// 	SidebarMenu,
// 	SidebarMenuButton,
// 	SidebarMenuItem,
// 	SidebarMenuSub,
// 	SidebarMenuSubButton,
// 	SidebarMenuSubItem,
// 	SidebarRail,
// } from "@/shared/ui/sidebar";
// import Link from "next/link";
// import Image from "next/image";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";

// type Props = {};

// const Index = (props: Props) => {
// 	return (
// 		<Sidebar {...props} className="z-20">
// 			<SidebarHeader className="flex items-center">
// 				<Link href="/">
// 					<Image src="/logo/vusik-logo.svg" alt="logo" width={140} height={0} />
// 				</Link>
// 			</SidebarHeader>
// 			<SidebarContent>
// 				<SidebarGroup>
// 					<SidebarGroupLabel>Application</SidebarGroupLabel>
// 					<SidebarGroupContent>
// 						<SidebarMenu>
// 							<Collapsible asChild className="group/collapsible">
// 								<SidebarMenuItem>
// 									<CollapsibleTrigger asChild>
// 										<SidebarMenuButton tooltip={"animals"}>
// 											<Image
// 												width={26}
// 												height={26}
// 												alt=""
// 												src="/icons/default-profile-icon.svg"
// 												// className="pointer-events-none absolute top-0 h-full w-full items-center justify-center p-4 group-hover:hidden"
// 											/>
// 											{/* {item.icon && <item.icon />} */}
// 											<span>animals</span>
// 										</SidebarMenuButton>
// 									</CollapsibleTrigger>
// 									{/* <CollapsibleContent>
// 										<SidebarMenuSub>
// 											<SidebarMenuSubItem>
// 												<SidebarMenuSubButton asChild>
// 													<span>1111111</span>
// 												</SidebarMenuSubButton>
// 											</SidebarMenuSubItem>
// 										</SidebarMenuSub>
// 									</CollapsibleContent> */}
// 									{/* <CollapsibleContent>
// 										<SidebarMenuSub>
// 											{item.items?.map((subItem) => (
// 												<SidebarMenuSubItem key={subItem.title}>
// 													<SidebarMenuSubButton asChild>
// 														<a href={subItem.url}>
// 															<span>{subItem.title}</span>
// 														</a>
// 													</SidebarMenuSubButton>
// 												</SidebarMenuSubItem>
// 											))}
// 										</SidebarMenuSub>
// 									</CollapsibleContent> */}
// 								</SidebarMenuItem>
// 							</Collapsible>
// 						</SidebarMenu>
// 					</SidebarGroupContent>
// 				</SidebarGroup>
// 			</SidebarContent>
// 			<SidebarRail />
// 			<SidebarFooter></SidebarFooter>
// 		</Sidebar>
// 	);
// };

// export default Index;

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
						<NavigationMenuItem className="flex w-full flex-col gap-4">
							<Link href={"/statistics"} legacyBehavior passHref>
								<NavigationMenuLink className={`flex w-full items-center justify-between`}>
									<span>Статистика</span>
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
