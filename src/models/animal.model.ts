// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { AnimalSchemaType } from "@/types/animal.type";
import ShelterModel from "./shelter.model";

const AnimalSchema = new Schema<AnimalSchemaType>(
	{
		name: {
			type: String,
			required: true,
		},
		species: {
			type: String,
			required: true,
		},
		breed: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			// ref: "User",
			required: true,
		},
		shelterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: ShelterModel,
		},
		mainPhoto: {
			type: String,
		},
		secondaryPhotos: {
			type: [String],
			default: undefined,
		},
		size: {
			type: String,
			required: true,
		},
		age: {
			type: String,
			required: true,
		},
		sex: {
			type: String,
			required: true,
		},
		sterilized: {
			type: Boolean,
			default: false,
		},
		injury: {
			type: Boolean,
			required: true,
			default: false,
		},
		injuryDescription: {
			type: String,
			required: function () {
				return this.injury;
			},
		},
	},
	{ timestamps: true },
);

const AnimalModel = mongoose?.models?.Animal || mongoose.model("Animal", AnimalSchema);

export default AnimalModel;