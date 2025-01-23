import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => {
	return <div className="flex h-[100vh] items-center justify-center">{children}</div>;
};

export default layout;
