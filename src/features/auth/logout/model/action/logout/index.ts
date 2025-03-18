"use server";

// next tools
import { cookies } from "next/headers";

const Index = async () => {
	cookies().delete("token");
};

export default Index;
