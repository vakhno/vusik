import { ReactNode } from "react";
// next tools
import type { Metadata } from "next";
import { cookies } from "next/headers";
// global styles
import "./globals.css";
// fonts
import { Roboto, Concert_One } from "next/font/google";
// libs
import { cn } from "@/lib/utils";
// API
import {
	SuccessResponse as UserByTokenSuccessResponse,
	ErrorResponse as UserByTokenErrorResponse,
} from "@/app/api/user/user-by-token/route";
// next-intl
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
// UI components
import { Toaster } from "@/components/ui/toaster";
// custom providers
import StoreProvider from "@/app/StoreProvider";
import TanstackQueryProvider from "@/app/TanstackQueryProvider";
// dev tools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["100", "300", "400", "500", "700"],
	variable: "--font-roboto",
});
const concertOne = Concert_One({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-concert-one",
});

export async function generateMetadata(): Promise<Metadata> {
	const locale = await getLocale();
	const t = await getTranslations({ locale });

	return {
		title: t("metadata.title"),
		description: t("metadata.description"),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const cookie = cookies();
	const token = cookie.get("token");
	let authUser = null;

	if (token) {
		const { value } = token;
		const response = await fetch(`${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/api/user/user-by-token`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${value}`,
			},
			credentials: "include",
		});
		const { ok } = response;
		if (ok) {
			const data: UserByTokenSuccessResponse | UserByTokenErrorResponse = await response.json();
			const { success } = data;

			if (success) {
				const { user } = data;
				authUser = user;
			}
		}
	}
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className="h-full">
			<body className={cn("font-inter h-full bg-background antialiased", roboto.variable, concertOne.variable)}>
				<NextIntlClientProvider messages={messages}>
					<StoreProvider
						userProviderInitialData={{ user: authUser }}
						// speciesProviderInitialData={{ list: speciesList }}
					>
						<TanstackQueryProvider>
							<ReactQueryDevtools initialIsOpen={false} />
							{children}
						</TanstackQueryProvider>
					</StoreProvider>
				</NextIntlClientProvider>
				<Toaster />
			</body>
		</html>
	);
}
