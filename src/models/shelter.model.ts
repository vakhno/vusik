// mongoose
import mongoose, { Schema } from "mongoose";
// types
import { ShelterType } from "@/types/shelter.type";

const ShelterSchema = new Schema<ShelterType>(
	{
		name: {
			type: String,
			required: true,
		},
		mainPhoto: {
			type: String,
		},
		secondaryPhotos: {
			type: [String],
			default: undefined,
		},
		country: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		street: {
			type: String,
		},
		coordinates: {
			lat: {
				type: Number,
				required: true,
			},
			lng: {
				type: Number,
				required: true,
			},
		},
		postalCode: {
			type: String,
			required: true,
		},
		activeMembers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Animal",
			},
		],
		adoptedMembers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Animal",
			},
		],
		workingDays: {
			monday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
			tuesday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
			wednesday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
			thursday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
			friday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
			saturday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
			sunday: {
				isWeekend: {
					type: Boolean,
					default: false,
				},
				begin: {
					type: String,
				},
				end: {
					type: String,
				},
			},
		},
		phone: {
			type: String,
			required: true,
		},
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		specificWeekends: [
			{
				month: {
					type: String,
				},
				day: {
					type: String,
				},
			},
		],
	},
	{ timestamps: true },
);

const ShelterModel = mongoose.models.Shelter || mongoose.model("Shelter", ShelterSchema);

export default ShelterModel;
