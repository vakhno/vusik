// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { LocaleType } from "@/types/locale.type";

const LocaleSchema = new Schema<LocaleType>(
	{
		code: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: true },
);

const LocaleModel = mongoose?.models?.Locale || mongoose.model("Locale", LocaleSchema);

export default LocaleModel;
