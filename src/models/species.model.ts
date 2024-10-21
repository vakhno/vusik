import mongoose, { Schema } from "mongoose";
import { SpeciesType } from "@/types/species.type";

const SpeciesSchema = new Schema<SpeciesType>({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	breed: [
		{
			type: String,
			required: true,
			default: [],
		},
	],
	size: [
		{
			type: String,
			required: true,
			default: [],
		},
	],
	sex: [
		{
			type: String,
			required: true,
			default: [],
		},
	],
});

const SpeciesModel = mongoose?.models?.Species || mongoose.model("Species", SpeciesSchema);

export default SpeciesModel;
