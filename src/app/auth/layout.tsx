import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => {
	return <div className="flex h-full items-center justify-center">{children}</div>;
};

export default layout;
