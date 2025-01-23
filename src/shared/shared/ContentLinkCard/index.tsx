import { ReactNode } from "react";
// ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { buttonVariants } from "@/shared/ui/button";
// next tools
import Link from "next/link";
// libs
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
	title: string;
	description: string;
	href: string;
	buttonTitle: string;
	children: ReactNode;
};

const index = ({ className, title, description, href, buttonTitle, children }: Props) => {
	return (
		<Card className={cn(className)}>
			<CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b p-6 max-md:flex-col">
				<div className="flex flex-1 flex-col justify-center gap-1 max-md:items-center">
					<CardTitle className="max-md:text-center">{title}</CardTitle>
					<CardDescription className="max-md:text-center">{description}</CardDescription>
				</div>
				<Link
					href={href}
					className={cn(
						buttonVariants(),
						'className="min-h-10 max-md:min-h-6" whitespace-normal break-words',
					)}
				>
					{buttonTitle}
				</Link>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">{children}</CardContent>
		</Card>
	);
};

export default index;
