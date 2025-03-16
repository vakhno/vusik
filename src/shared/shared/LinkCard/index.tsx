// ui
import { Card, CardContent, CardTitle } from "@/shared/ui/card";
import { buttonVariants } from "@/shared/ui/button";
// libs
import { cn } from "@/shared/lib/utils";
// next tools
import Link from "next/link";

type Props = {
	className?: string;
	title: string;
	href: string;
	buttonTitle: string;
};

const Index = ({ className, title, href, buttonTitle }: Props) => {
	return (
		<Card className={cn(className, "flex flex-1 flex-col")}>
			<CardContent className="flex h-full flex-1 flex-col justify-between gap-4 p-6">
				<CardTitle>{title}</CardTitle>
				<Link
					href={href}
					className={cn(buttonVariants(), "h-auto min-h-10 whitespace-normal break-words max-md:min-h-6")}
				>
					{buttonTitle}
				</Link>
			</CardContent>
		</Card>
	);
};

export default Index;
