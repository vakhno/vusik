// shared
import TextBetweenSeparators from "@/shared/shared/TextBetweenSeparators";
import { cn } from "@/shared/lib/utils";
import { getCurrentYear } from "@/shared/utils/getCurrentYear";
// next tools
import Link from "next/link";

interface Props {
	className?: string;
}

const Header = ({ className }: Props) => {
	const currentYear = getCurrentYear();

	return (
		<footer className={cn(className, "sticky top-[100%] z-50 m-auto h-20 w-full backdrop-blur-md")}>
			<div className="flex h-full w-full items-center justify-between px-4">
				<TextBetweenSeparators
					className="flex w-full"
					text={
						<>
							<span>Created by </span>
							<Link href="https://github.com/vakhno" className="text-primary">
								Vakhno
							</Link>
							<span> © </span>
							{currentYear}
						</>
					}
				/>
			</div>
		</footer>
	);
};

export default Header;
