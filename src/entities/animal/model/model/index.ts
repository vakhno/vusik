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
			required: true,
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
		birthday: {
			type: Date,
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
		vaccinated: {
			type: Boolean,
			default: false,
		},
		dewormed: {
			type: Boolean,
			default: false,
		},
		passported: {
			type: Boolean,
			default: false,
		},
		microchiped: {
			type: Boolean,
			default: false,
		},
		injury: {
			type: Boolean,
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
