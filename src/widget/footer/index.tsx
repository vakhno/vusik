// libs
import TextBetweenSeparators from "@/shared/shared/TextBetweenSeparators";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

interface Props {
	className?: string;
}

const Header = ({ className }: Props) => {
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
							{new Date().getFullYear()}
						</>
					}
				/>
			</div>
		</footer>
	);
};

export default Header;
