"use server";

// next-intl
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
// zod
import { ZodType } from "zod";

type SchemaProps = {
	t: (key: string) => string;
};

type SchemaFunction = (props: SchemaProps) => ZodType<unknown>;

type Result = ZodType<unknown> | false;

export const getSchemaWithLocale = async (schema: SchemaFunction): Promise<Result> => {
	try {
		const locale = await getLocale();
		const t = await getTranslations({ locale });
		const newShelterSchema = schema({ t });

		return newShelterSchema;
	} catch (_) {
		return false;
	}
};
