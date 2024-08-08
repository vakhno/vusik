// UI components
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
// components
import Trigger from "./popoverTrigger/index";
import Content from "./popoverContent/index";

interface Props {
	avatar: string;
}

const AuthUser = ({ avatar }: Props) => {
	return (
		<>
			<Popover>
				<PopoverTrigger>
					<Trigger avatar={avatar} />
				</PopoverTrigger>
				<PopoverContent className="w-auto">
					<Content />
				</PopoverContent>
			</Popover>
		</>
	);
};

export default AuthUser;
