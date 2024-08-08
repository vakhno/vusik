import { ReactNode } from "react";
import Header from "@/features/header/index";

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
};

export default layout;
