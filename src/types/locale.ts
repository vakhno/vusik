import { locales } from "@/constants/locale";

export type Locale = (typeof locales)[number];
export type Locales = keyof typeof locales;
