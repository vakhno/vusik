// components
import HeaderLogo from "./headerLogo/index";
import HeaderContent from "./headerContent";
// libs
import { cn } from "@/lib/utils";

interface Props {
	className?: string;
}

const Header = ({ className }: Props) => {
	return (
		<header className={cn(className, "sticky top-0 h-20 w-full backdrop-blur-md")}>
			<div className="flex h-full w-full items-center justify-between px-4">
				<HeaderLogo />
				<HeaderContent />
			</div>
		</header>
	);
};

export default Header;
