// components
import HeaderUser from "./headerUser";
// widgets
import LocaleSwitcher from "@/widget/localeSwitcher";

const HeaderContent = () => {
	return (
		<div className="flex">
			<LocaleSwitcher />
			<HeaderUser />
		</div>
	);
};

export default HeaderContent;
