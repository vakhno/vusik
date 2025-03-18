import { createContext } from "react";
import UserSlice from "@/shared/zustand/slice/user.slice";

const UserContext = createContext<ReturnType<typeof UserSlice> | null>(null);

export default UserContext;
