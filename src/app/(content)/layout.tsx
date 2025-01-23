import { ReactNode } from "react";
import Header from "@/widget/header";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => {
	return (
		<SidebarProvider defaultOpen={false}>
			<SidebarInset className="w-full">
				<Header />
				<main className="mx-auto my-4 w-full max-w-[1400px] px-2">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default layout;
