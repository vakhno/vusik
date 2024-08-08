"use client";
// next tools
import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
	return (
		<Link href="/">
			<Image src="/logo/vusik-logo.svg" alt="logo" width={140} height={0} />
		</Link>
	);
};

export default HeaderLogo;
