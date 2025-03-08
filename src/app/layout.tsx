// react
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
import { Toaster } from "@/shared/ui/toaster";
// custom providers
import StoreProvider from "@/providers/StoreProvider";
import QueryProvider from "@/providers/QueryProvider";
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
		title: t("metadata.page.home.title"),
		description: t("metadata.page.home.description"),
		openGraph: {
			title: t("metadata.page.home.title"),
			description: t("metadata.page.home.description"),
			url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}`,
			siteName: t("general.site-name"),
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/home/1200x630.jpg`,
					width: 1200,
					height: 630,
					alt: t("metadata.page.home.openGraph.image.alt"),
					type: "image/jpeg",
				},
			],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: t("metadata.page.home.twitter.title"),
			description: t("metadata.page.home.twitter.description"),
			images: `${process.env.NEXT_PUBLIC_ACTIVE_DOMEN}/openGraph/home/twitter/1200x630.jpg`,
		},
		keywords: t("metadata.page.home.keywords"),
	};
}

export const viewport = "width=device-width, initial-scale=1";

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
		<html lang={locale}>
			<body
				className={cn("font-inter h-[100vh] bg-background antialiased", roboto.variable, concertOne.variable)}
			>
				<NextIntlClientProvider messages={messages}>
					<StoreProvider userProviderInitialData={{ user: authUser }}>
						<QueryProvider>
							<ReactQueryDevtools initialIsOpen={false} />
							{children}
						</QueryProvider>
					</StoreProvider>
				</NextIntlClientProvider>
				<Toaster />
			</body>
		</html>
	);
}
