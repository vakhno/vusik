"use server";
import { cookies } from "next/headers";

const logout = async () => {
	cookies().delete("token");
};

export default logout;
