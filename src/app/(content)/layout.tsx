import { ReactNode } from "react";
import Header from "@/features/header/index";

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => {
	return (
		<div>
			<Header />
			<div className="m-auto max-w-[1400px]">{children}</div>
		</div>
	);
};

export default layout;
