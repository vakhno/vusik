// mongoose
import mongoose, { Schema, Model } from "mongoose";
// types
import { AnimalType } from "@/entities/animal/model/type/animal";

const AnimalSchema = new Schema<AnimalType>(
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
			ref: "User",
			required: true,
		},
		shelterId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Shelter",
		},
		mainPhoto: {
			type: String,
			default: null,
		},
		secondaryPhotos: [
			{
				type: String,
				default: [],
			},
		],
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

const AnimalModel: Model<AnimalType> = mongoose?.models?.Animal || mongoose.model("Animal", AnimalSchema);

export default AnimalModel;
