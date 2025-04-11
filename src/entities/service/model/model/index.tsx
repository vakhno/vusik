// mongoose
import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema({
	animal: {
		species: {
			type: Map,
			of: new Schema({
				breeds: {
					type: [String],
					required: true,
				},
				sex: {
					type: [String],
					required: true,
				},
				size: {
					type: [String],
					required: true,
				},
			}),
			default: {},
		},
		color: {
			type: [String],
			default: [],
		},
		trainingLevel: {
			type: [String],
			default: [],
		},
		adoptionStatus: {
			type: [String],
			default: [],
		},
		countPerPage: {
			type: Number,
			default: 10,
		},
	},
	shelter: {
		category: {
			type: [String],
			default: [],
		},
		countPerPage: {
			type: Number,
			default: 10,
		},
	},
	profile: {
		roles: {
			type: [String],
			default: [],
		},
	},
	map: {
		center: {
			lat: {
				type: Number,
				default: 0,
			},
			lng: {
				type: Number,
				default: 0,
			},
		},
	},
	locale: {
		defaultLocale: {
			type: String,
		},
		locales: {
			type: [String],
			default: [],
		},
	},
});

const ServiceModel = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default ServiceModel;
