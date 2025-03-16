"use client";

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const TanstackQueryProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
	const [queryClient] = useState(() => new QueryClient());

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanstackQueryProvider;
