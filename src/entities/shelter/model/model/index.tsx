// mongoose
import mongoose, { Schema, Model } from "mongoose";
// types
import { ShelterType } from "@/entities/shelter/model/type/shelter";

const ShelterSchema = new Schema<ShelterType>(
	{
		type: {
			type: String,
			required: true,
		},
		isCharitable: {
			type: Boolean,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		losung: {
			type: String,
			required: true,
		},
		story: {
			type: String,
			required: true,
		},
		mission: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		logo: {
			type: String,
			default: null,
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
		country: {
			type: String,
			required: true,
		},
		state: {
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
		deletedMembers: [
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
				_id: false,
			},
		],
	},
	{ timestamps: true },
);

const ShelterModel: Model<ShelterType> = mongoose.models.Shelter || mongoose.model("Shelter", ShelterSchema);

export default ShelterModel;
